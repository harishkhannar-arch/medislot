import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../pages.css';

export function BookingSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = location.state?.appointmentId;
  const slotTime = location.state?.slotTime;

  return (
    <div className="booking-success-page">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1>Appointment Booked Successfully!</h1>

        <div className="appointment-details">
          <p>
            <strong>Appointment ID:</strong> {appointmentId || 'N/A'}
          </p>
          {slotTime && (
            <p>
              <strong>Scheduled Time:</strong>{' '}
              {new Date(slotTime).toLocaleString()}
            </p>
          )}
        </div>

        <p className="success-message">
          Your appointment has been confirmed. You will receive a confirmation
          email shortly.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/patient')}
        >
          ← Back to Doctors
        </button>
      </div>
    </div>
  );
}
