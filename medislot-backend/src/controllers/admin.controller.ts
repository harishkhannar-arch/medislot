import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class AdminController {
  // Create clinic
  static async createClinic(req: Request, res: Response) {
    try {
      const { name, address, phone } = req.body;

      if (!name || !address || !phone) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(
        `INSERT INTO clinics (id, name, address, phone) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [uuidv4(), name, address, phone]
      );

      res.status(201).json({
        message: '✅ Clinic created successfully',
        clinic: result.rows,
      });
    } catch (error) {
      console.error('❌ Error creating clinic:', error);
      res.status(500).json({ error: 'Failed to create clinic' });
    }
  }

  // Get all clinics
  static async listClinics(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM clinics ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('❌ Error fetching clinics:', error);
      res.status(500).json({ error: 'Failed to fetch clinics' });
    }
  }

  // Create doctor
  static async createDoctor(req: Request, res: Response) {
    try {
      const { clinic_id, name, specialization, email, phone } = req.body;

      if (!clinic_id || !name || !specialization || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(
        `INSERT INTO doctors (id, clinic_id, name, specialization, email, phone) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [uuidv4(), clinic_id, name, specialization, email, phone || null]
      );

      res.status(201).json({
        message: '✅ Doctor created successfully',
        doctor: result.rows,
      });
    } catch (error) {
      console.error('❌ Error creating doctor:', error);
      res.status(500).json({ error: 'Failed to create doctor' });
    }
  }

  // Create slots
  static async createSlots(req: Request, res: Response) {
    try {
      const { doctor_id, start_time, end_time } = req.body;

      if (!doctor_id || !start_time || !end_time) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(
        `INSERT INTO slots (id, doctor_id, start_time, end_time, status) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [uuidv4(), doctor_id, start_time, end_time, 'AVAILABLE']
      );

      res.status(201).json({
        message: '✅ Slot created successfully',
        slot: result.rows,
      });
    } catch (error) {
      console.error('❌ Error creating slot:', error);
      res.status(500).json({ error: 'Failed to create slot' });
    }
  }

  // Get admin stats
  static async getStats(req: Request, res: Response) {
  try {
    const clinicsCount = await pool.query('SELECT COUNT(*) AS count FROM clinics');
    const doctorsCount = await pool.query('SELECT COUNT(*) AS count FROM doctors');
    const appointmentsCount = await pool.query('SELECT COUNT(*) AS count FROM appointments');
    const slotsCount = await pool.query(
      'SELECT COUNT(*) AS count FROM slots WHERE status = $1',
      ['AVAILABLE']
    );

    res.json({
      clinics: parseInt(clinicsCount.rows[0].count, 10),
      doctors: parseInt(doctorsCount.rows[0].count, 10),
      appointments: parseInt(appointmentsCount.rows[0].count, 10),
      availableSlots: parseInt(slotsCount.rows[0].count, 10),
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
 }
}
