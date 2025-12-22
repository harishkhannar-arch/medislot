import { Request, Response } from 'express';
import  pool  from '../config/database';

export const slotController = {
  // Get slots by doctor
  getSlotsByDoctor: async (req: Request, res: Response) => {
    const { doctor_id } = req.query;

    if (!doctor_id) {
      return res.status(400).json({ message: 'doctor_id is required' });
    }

    try {
      const result = await pool.query(
        'SELECT * FROM slots WHERE doctor_id = $1 ORDER BY start_time ASC',
        [doctor_id]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ message: 'Failed to fetch slots' });
    }
  },

  // Create slot
  createSlot: async (req: Request, res: Response) => {
    const { doctor_id, start_time, end_time } = req.body;

    if (!doctor_id || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO slots (doctor_id, start_time, end_time, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [doctor_id, start_time, end_time, 'AVAILABLE']
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating slot:', error);
      res.status(500).json({ message: 'Failed to create slot' });
    }
  },

  // Update slot
  updateSlot: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;

    try {
      const result = await pool.query(
        'UPDATE slots SET start_time = $1, end_time = $2 WHERE id = $3 RETURNING *',
        [start_time, end_time, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Slot not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating slot:', error);
      res.status(500).json({ message: 'Failed to update slot' });
    }
  },

  // Delete slot
  deleteSlot: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM slots WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Slot not found' });
      }

      res.json({ message: 'Slot deleted successfully' });
    } catch (error) {
      console.error('Error deleting slot:', error);
      res.status(500).json({ message: 'Failed to delete slot' });
    }
  },
};
