export const TRIAGE_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  NORMAL: 'NORMAL',
} as const;

export const TRIAGE_COLORS = {
  CRITICAL: '#dc3545',
  HIGH: '#ffc107',
  NORMAL: '#28a745',
} as const;

export const TRIAGE_LABELS = {
  CRITICAL: '🔴 Critical - Immediate attention required',
  HIGH: '🟠 High - Urgent attention needed',
  NORMAL: '🟢 Normal - Routine booking',
} as const;

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
] as const;
