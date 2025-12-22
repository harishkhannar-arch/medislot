export interface Doctor {
  id: string;
  clinic_id: string;
  name: string;
  specialization: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface CreateDoctorRequest {
  clinic_id: string;
  name: string;
  specialization: string;
  email: string;
  phone?: string;
}

export const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'ENT',
  'General Medicine',
  'Psychiatry',
  'Dentistry',
  'Ophthalmology',
];
