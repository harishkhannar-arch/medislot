export type TriageLevel = 'CRITICAL' | 'HIGH' | 'NORMAL';

export interface Slot {
  id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  symptoms: string;
  triage_level: TriageLevel;
  status: 'CONFIRMED' | 'CANCELLED';
  patient_name?: string;
  doctor_name?: string;
  clinic_name?: string;
  start_time?: string;
  created_at: string;
}

export interface BookingRequest {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_id: string;
  slot_id: string;
  symptoms: string;
  triage_level: TriageLevel;
}
