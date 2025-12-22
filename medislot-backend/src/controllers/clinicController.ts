import { Request, Response } from 'express';
import pool from "../config/database"
 // or your database connection

export const clinicController = {
  // Get all clinics
  getAllClinics: async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM clinics ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      res.status(500).json({ message: 'Failed to fetch clinics' });
    }
  },

  // Get single clinic
  getClinicById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM clinics WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Clinic not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching clinic:', error);
      res.status(500).json({ message: 'Failed to fetch clinic' });
    }
  },

  // Create clinic
  createClinic: async (req: Request, res: Response) => {
    const { name, address, phone } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO clinics (name, address, phone) VALUES ($1, $2, $3) RETURNING *',
        [name, address, phone]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating clinic:', error);
      res.status(500).json({ message: 'Failed to create clinic' });
    }
  },

  // Update clinic
  updateClinic: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;

    try {
      const result = await pool.query(
        'UPDATE clinics SET name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING *',
        [name, address, phone, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Clinic not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating clinic:', error);
      res.status(500).json({ message: 'Failed to update clinic' });
    }
  },

  // Delete clinic
  deleteClinic: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM clinics WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Clinic not found' });
      }

      res.json({ message: 'Clinic deleted successfully' });
    } catch (error) {
      console.error('Error deleting clinic:', error);
      res.status(500).json({ message: 'Failed to delete clinic' });
    }
  },
};
