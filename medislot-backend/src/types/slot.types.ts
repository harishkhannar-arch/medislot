export interface Slot {
  id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  status: 'AVAILABLE' | 'BOOKED';
  created_at: string;
}

export interface CreateSlotRequest {
  doctor_id: string;
  start_time: string;
  end_time: string;
}
