import React, { useState } from 'react';
import { TriageLevel, BookingRequest, Slot } from '../../types/appointment';
import { Doctor } from '../../types/doctor';
import { TriageSelector } from './TriageSelector';
import './booking.css';

interface BookingFormProps {
  doctor: Doctor;
  selectedSlot: Slot | null;
  onSubmit: (request: BookingRequest) => Promise<void>;
  loading: boolean;
}

export function BookingForm({
  doctor,
  selectedSlot,
  onSubmit,
  loading,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    symptoms: '',
    triage_level: 'NORMAL' as TriageLevel,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTriageChange = (level: TriageLevel) => {
    setFormData((prev) => ({
      ...prev,
      triage_level: level,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    if (!formData.patient_name || !formData.patient_email || !formData.patient_phone) {
      alert('Please fill in all required fields');
      return;
    }

    const request: BookingRequest = {
      ...formData,
      doctor_id: doctor.id,
      slot_id: selectedSlot.id,
    };

    await onSubmit(request);
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>📋 Your Details</h2>

      <div className="form-group">
        <label htmlFor="patient_name" className="form-label">
          Full Name *
        </label>
        <input
          type="text"
          id="patient_name"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          placeholder="John Doe"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="patient_email" className="form-label">
          Email *
        </label>
        <input
          type="email"
          id="patient_email"
          name="patient_email"
          value={formData.patient_email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="patient_phone" className="form-label">
          Phone *
        </label>
        <input
          type="tel"
          id="patient_phone"
          name="patient_phone"
          value={formData.patient_phone}
          onChange={handleChange}
          placeholder="9999999999"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="symptoms" className="form-label">
          Symptoms/Reason for visit
        </label>
        <textarea
          id="symptoms"
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          placeholder="Describe your symptoms..."
          className="form-input form-textarea"
          rows={4}
        />
      </div>

      <TriageSelector
        selected={formData.triage_level}
        onSelect={handleTriageChange}
      />

      <button
        type="submit"
        className="btn btn-primary btn-full-width"
        disabled={loading || !selectedSlot}
      >
        {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
      </button>
    </form>
  );
}
