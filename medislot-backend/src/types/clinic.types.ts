export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  created_at: string;
}

export interface CreateClinicRequest {
  name: string;
  address: string;
  phone: string;
}
