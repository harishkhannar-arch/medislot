import api from './api';
import { BookingRequest, Appointment } from '../types/appointment';

export interface BookingResponse {
  status: 'CONFIRMED' | 'FAILED';
  appointmentId?: string;
  slotTime?: string;
  triageLevel?: string;
  reason?: string;
  suggestedSlots?: any[];
}

export class AppointmentService {
  /**
   * Book an appointment ⭐ CORE METHOD
   * This calls the backend booking endpoint which has transaction safety
   */
  static async bookAppointment(request: BookingRequest): Promise<BookingResponse> {
    try {
      const response = await api.post('/appointments', {
        patient_name: request.patient_name,
        patient_email: request.patient_email,
        patient_phone: request.patient_phone,
        doctor_id: request.doctor_id,
        slot_id: request.slot_id,
        symptoms: request.symptoms,
        triage_level: request.triage_level,
      });
      return response.data;
    } catch (error: any) {
      console.error('Booking error:', error);
      // If server returned error response, return it
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  /**
   * Get appointment details by ID
   */
  static async getAppointmentById(appointmentId: string): Promise<Appointment> {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  /**
   * Get all appointments for a patient by email
   */
  static async getPatientAppointments(email: string): Promise<Appointment[]> {
    try {
      const response = await api.get('/appointments', {
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   */
  static async cancelAppointment(appointmentId: string): Promise<{ message: string }> {
    try {
      const response = await api.patch(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
}
