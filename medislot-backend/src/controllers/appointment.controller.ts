import { Request, Response } from 'express';
import pool from '../config/database';
import { BookAppointmentRequest } from '../types/appointment.types';
import { BookingService } from '../services/booking.service';

export class AppointmentController {
  // Book appointment ⭐ CORE ENDPOINT
  static async bookAppointment(req: Request, res: Response) {
    try {
      const bookingRequest = req.body as BookAppointmentRequest;

      // Validate input
      if (
        !bookingRequest.patient_name ||
        !bookingRequest.patient_email ||
        !bookingRequest.doctor_id ||
        !bookingRequest.slot_id ||
        !bookingRequest.triage_level
      ) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await BookingService.bookAppointment(bookingRequest);
      const statusCode = result.status === 'CONFIRMED' ? 201 : 409;

      res.status(statusCode).json(result);
    } catch (error) {
      console.error('❌ Booking error:', error);
      res.status(500).json({ error: 'Booking failed' });
    }
  }

  // Get appointment detail
  static async getAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT a.*, p.name as patient_name, d.name as doctor_name, s.start_time
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         JOIN doctors d ON a.doctor_id = d.id
         JOIN slots s ON a.slot_id = s.id
         WHERE a.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json(result.rows);
    } catch (error) {
      console.error('❌ Error fetching appointment:', error);
      res.status(500).json({ error: 'Failed to fetch appointment' });
    }
  }

  // Get patient appointments
  static async getPatientAppointments(req: Request, res: Response) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      const result = await pool.query(
        `SELECT a.*, p.name as patient_name, d.name as doctor_name, 
                c.name as clinic_name, s.start_time, s.end_time
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         JOIN doctors d ON a.doctor_id = d.id
         JOIN clinics c ON d.clinic_id = c.id
         JOIN slots s ON a.slot_id = s.id
         WHERE p.email = $1
         ORDER BY s.start_time DESC`,
        [email]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }

  // Cancel appointment
  static async cancelAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get appointment and slot
      const appointmentResult = await pool.query(
        'SELECT slot_id FROM appointments WHERE id = $1',
        [id]
      );

      if (appointmentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const slotId = appointmentResult.rows[0].slot_id;

      // Update appointment status
      await pool.query(
        'UPDATE appointments SET status = $1 WHERE id = $2',
        ['CANCELLED', id]
      );

      // Mark slot as available again
      await pool.query(
        'UPDATE slots SET status = $1 WHERE id = $2',
        ['AVAILABLE', slotId]
      );

      res.json({ message: '✅ Appointment cancelled successfully' });
    } catch (error) {
      console.error('❌ Error cancelling appointment:', error);
      res.status(500).json({ error: 'Failed to cancel appointment' });
    }
  }
}
