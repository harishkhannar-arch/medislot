import { Request, Response } from 'express';
import pool from '../config/database';

export class DoctorController {
  // Get all doctors
  static async listDoctors(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT d.*, c.name as clinic_name
         FROM doctors d
         LEFT JOIN clinics c ON d.clinic_id = c.id
         ORDER BY d.created_at DESC`
      );
      res.json(result.rows);
    } catch (error) {
      console.error('❌ Error fetching doctors:', error);
      res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  }

  // Get doctor detail
  static async getDoctorDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT d.*, c.name as clinic_name, c.address, c.phone as clinic_phone
         FROM doctors d
         LEFT JOIN clinics c ON d.clinic_id = c.id
         WHERE d.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('❌ Error fetching doctor:', error);
      res.status(500).json({ error: 'Failed to fetch doctor' });
    }
  }

  // Get available slots for doctor (patient view)
  static async getDoctorSlots(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT * FROM slots
         WHERE doctor_id = $1 AND status = 'AVAILABLE'
         AND start_time > NOW()
         ORDER BY start_time ASC`,
        [id]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('❌ Error fetching slots:', error);
      res.status(500).json({ error: 'Failed to fetch slots' });
    }
  }

  // ---------- ADMIN CRUD METHODS ----------

  // Create doctor
  static async createDoctor(req: Request, res: Response) {
    const { clinic_id, name, specialization, email, phone } = req.body;

    if (!clinic_id || !name || !specialization || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const result = await pool.query(
        `INSERT INTO doctors (clinic_id, name, specialization, email, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [clinic_id, name, specialization, email, phone || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating doctor:', error);
      res.status(500).json({ message: 'Failed to create doctor' });
    }
  }

  // Update doctor
  static async updateDoctor(req: Request, res: Response) {
    const { id } = req.params;
    const { clinic_id, name, specialization, email, phone } = req.body;

    try {
      const result = await pool.query(
        `UPDATE doctors
         SET clinic_id = $1,
             name = $2,
             specialization = $3,
             email = $4,
             phone = $5
         WHERE id = $6
         RETURNING *`,
        [clinic_id, name, specialization, email, phone || null, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating doctor:', error);
      res.status(500).json({ message: 'Failed to update doctor' });
    }
  }

  // Delete doctor
  static async deleteDoctor(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'DELETE FROM doctors WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      console.error('Error deleting doctor:', error);
      res.status(500).json({ message: 'Failed to delete doctor' });
    }
  }
}
