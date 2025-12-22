export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface CreatePatientRequest {
  name: string;
  email: string;
  phone: string;
}
