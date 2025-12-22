import React from 'react';
import { Doctor } from '../../types/doctor';
import './doctor.css';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  return (
    <div className="doctor-card">
      <div className="doctor-header">
        <h3>👨‍⚕️ {doctor.name}</h3>
        <span className="specialization-badge">
          {doctor.specialization}
        </span>
      </div>

      <div className="doctor-info">
        <p><strong>📍 Clinic:</strong> {doctor.clinic_name}</p>
        <p><strong>📧 Email:</strong> {doctor.email}</p>
        {doctor.phone && <p><strong>📞 Phone:</strong> {doctor.phone}</p>}
      </div>

      <button
        className="btn btn-primary btn-full-width"
        onClick={() => onSelect(doctor)}
      >
        Book Appointment →
      </button>
    </div>
  );
}
