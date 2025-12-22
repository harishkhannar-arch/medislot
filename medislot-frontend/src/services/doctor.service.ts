import api from './api';
import { Doctor } from '../types/doctor';
import { Slot } from '../types/appointment';

export class DoctorService {
  /**
   * Get all doctors with their clinic info
   */
  static async getAllDoctors(): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  /**
   * Get single doctor detail by ID
   */
  static async getDoctorById(doctorId: string): Promise<Doctor> {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor detail:', error);
      throw error;
    }
  }

  /**
   * Get available slots for a specific doctor
   * Only returns AVAILABLE slots with future start_time
   */
  static async getAvailableSlots(doctorId: string): Promise<Slot[]> {
    try {
      const response = await api.get(`/doctors/${doctorId}/slots`);
      return response.data;
    } catch (error) {
      console.error('Error fetching slots:', error);
      throw error;
    }
  }
  // ADD THESE METHODS to existing DoctorService class

/**
 * Create new doctor
 */
static async createDoctor(doctor: Omit<Doctor, 'id' | 'created_at'>): Promise<Doctor> {
  try {
    const response = await api.post('/doctors', doctor);
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
}

/**
 * Update doctor
 */
static async updateDoctor(
  doctorId: string,
  doctor: Partial<Omit<Doctor, 'id' | 'created_at'>>
): Promise<Doctor> {
  try {
    const response = await api.put(`/doctors/${doctorId}`, doctor);
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
}

/**
 * Delete doctor
 */
static async deleteDoctor(doctorId: string): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
}

}
