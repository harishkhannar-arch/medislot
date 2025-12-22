import pool from '../config/database';
import { BookAppointmentRequest, BookAppointmentResponse } from '../types/appointment.types';
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
  /**
   * Books an appointment with transaction safety
   * Uses FOR UPDATE lock to prevent race conditions
   * Only 1 person can book a slot at a time
   */
  static async bookAppointment(
    req: BookAppointmentRequest
  ): Promise<BookAppointmentResponse> {
    const client = await pool.connect();

    try {
      // START TRANSACTION
      await client.query('BEGIN');

      // ⭐ CRITICAL: Row-level lock on slot
      // This prevents 2 people from booking the same slot simultaneously
      const slotResult = await client.query(
        'SELECT * FROM slots WHERE id = $1 FOR UPDATE',
        [req.slot_id]
      );

      if (slotResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          status: 'FAILED',
          reason: 'Slot not found',
        };
      }

      const slot = slotResult.rows[0];

      // Check if slot is already booked
      if (slot.status !== 'AVAILABLE') {
        await client.query('ROLLBACK');

        // For CRITICAL patients, suggest alternatives
        let suggestedSlots = [];
        if (req.triage_level === 'CRITICAL') {
          const suggested = await client.query(
            `SELECT * FROM slots 
             WHERE doctor_id = $1 AND status = 'AVAILABLE' 
             AND start_time > NOW()
             ORDER BY start_time 
             LIMIT 3`,
            [req.doctor_id]
          );
          suggestedSlots = suggested.rows;
        }

        return {
          status: 'FAILED',
          reason: 'Slot already booked by someone else',
          suggestedSlots: suggestedSlots.length > 0 ? suggestedSlots : undefined,
        };
      }

      // Create or get patient
      const patientResult = await client.query(
        `INSERT INTO patients (id, name, email, phone) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name 
         RETURNING *`,
        [uuidv4(), req.patient_name, req.patient_email, req.patient_phone]
      );

      const patient = patientResult.rows[0];

      // Create appointment
      const appointmentId = uuidv4();
      const appointmentResult = await client.query(
        `INSERT INTO appointments 
         (id, patient_id, doctor_id, slot_id, symptoms, triage_level, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          appointmentId,
          patient.id,
          req.doctor_id,
          req.slot_id,
          req.symptoms,
          req.triage_level,
          'CONFIRMED',
        ]
      );

      // Mark slot as booked
      await client.query(
        'UPDATE slots SET status = $1 WHERE id = $2',
        ['BOOKED', req.slot_id]
      );

      // COMMIT TRANSACTION
      await client.query('COMMIT');

      return {
        status: 'CONFIRMED',
        appointmentId: appointmentResult.rows[0].id,
        slotTime: slot.start_time,
        triageLevel: req.triage_level,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Booking error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get suggested slots for CRITICAL patients
   */
  static async getSuggestedSlots(doctorId: string, limit: number = 3) {
    const result = await pool.query(
      `SELECT * FROM slots 
       WHERE doctor_id = $1 AND status = 'AVAILABLE'
       AND start_time > NOW()
       ORDER BY start_time 
       LIMIT $2`,
      [doctorId, limit]
    );
    return result.rows;
  }
}
