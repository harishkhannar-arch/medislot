import api from './api';
import { Clinic } from '../types/clinic';

export class ClinicService {
  /**
   * Get all clinics
   */
  static async getAllClinics(): Promise<Clinic[]> {
    try {
      const response = await api.get('/clinics');
      return response.data;
    } catch (error) {
      console.error('Error fetching clinics:', error);
      throw error;
    }
  }

  /**
   * Get single clinic by ID
   */
  static async getClinicById(clinicId: string): Promise<Clinic> {
    try {
      const response = await api.get(`/clinics/${clinicId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clinic:', error);
      throw error;
    }
  }

  /**
   * Create new clinic
   */
  static async createClinic(clinic: Omit<Clinic, 'id' | 'created_at'>): Promise<Clinic> {
    try {
      const response = await api.post('/clinics', clinic);
      return response.data;
    } catch (error) {
      console.error('Error creating clinic:', error);
      throw error;
    }
  }

  /**
   * Update clinic
   */
  static async updateClinic(
    clinicId: string,
    clinic: Partial<Omit<Clinic, 'id' | 'created_at'>>
  ): Promise<Clinic> {
    try {
      const response = await api.put(`/clinics/${clinicId}`, clinic);
      return response.data;
    } catch (error) {
      console.error('Error updating clinic:', error);
      throw error;
    }
  }

  /**
   * Delete clinic
   */
  static async deleteClinic(clinicId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/clinics/${clinicId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting clinic:', error);
      throw error;
    }
  }
}
