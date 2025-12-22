import api from './api';
import { Slot } from '../types/appointment';

export interface SlotCreateRequest {
  doctor_id: string;
  start_time: string;
  end_time: string;
}

export class SlotService {
  /**
   * Get all slots for a doctor (admin view)
   */
  static async getSlotsByDoctor(doctorId: string): Promise<Slot[]> {
    try {
      const response = await api.get(`/slots?doctor_id=${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching slots:', error);
      throw error;
    }
  }

  /**
   * Create new slot
   */
  static async createSlot(slot: SlotCreateRequest): Promise<Slot> {
    try {
      const response = await api.post('/slots', slot);
      return response.data;
    } catch (error) {
      console.error('Error creating slot:', error);
      throw error;
    }
  }

  /**
   * Update slot
   */
  static async updateSlot(
    slotId: string,
    slot: Partial<SlotCreateRequest>
  ): Promise<Slot> {
    try {
      const response = await api.put(`/slots/${slotId}`, slot);
      return response.data;
    } catch (error) {
      console.error('Error updating slot:', error);
      throw error;
    }
  }

  /**
   * Delete slot
   */
  static async deleteSlot(slotId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/slots/${slotId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting slot:', error);
      throw error;
    }
  }
}
