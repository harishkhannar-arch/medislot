export type TriageLevel = 'CRITICAL' | 'HIGH' | 'NORMAL';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  symptoms: string;
  triage_level: TriageLevel;
  status: 'CONFIRMED' | 'CANCELLED';
  created_at: string;
}

export interface BookAppointmentRequest {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_id: string;
  slot_id: string;
  symptoms: string;
  triage_level: TriageLevel;
}

export interface BookAppointmentResponse {
  status: 'CONFIRMED' | 'FAILED';
  appointmentId?: string;
  slotTime?: string;
  triageLevel?: TriageLevel;
  reason?: string;
  suggestedSlots?: any[];
}
