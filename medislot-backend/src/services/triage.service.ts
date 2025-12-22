import { TriageLevel } from '../types/appointment.types';

const CRITICAL_KEYWORDS = [
  'chest pain',
  'difficulty breathing',
  'severe bleeding',
  'unconscious',
  'seizure',
  'acute trauma',
];

const HIGH_KEYWORDS = [
  'high fever',
  'moderate pain',
  'severe headache',
  'vertigo',
  'moderate bleeding',
];

export class TriageService {
  static analyzeSymptoms(symptoms: string): TriageLevel {
    const lowerSymptoms = symptoms.toLowerCase();

    // Check CRITICAL keywords
    for (const keyword of CRITICAL_KEYWORDS) {
      if (lowerSymptoms.includes(keyword)) {
        return 'CRITICAL';
      }
    }

    // Check HIGH keywords
    for (const keyword of HIGH_KEYWORDS) {
      if (lowerSymptoms.includes(keyword)) {
        return 'HIGH';
      }
    }

    // Default to NORMAL
    return 'NORMAL';
  }

  static getRecommendation(triageLevel: TriageLevel): string {
    const recommendations = {
      CRITICAL: '⚠️ CRITICAL: Immediate attention required. Booking fastest available slot.',
      HIGH: '🟠 HIGH: Urgent attention needed. Prioritizing slots.',
      NORMAL: '🟢 NORMAL: Routine booking. Standard slot allocation.',
    };
    return recommendations[triageLevel];
  }
}
