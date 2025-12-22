import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../pages.css';

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const handleSelectRole = (role: 'admin' | 'patient') => {
    setRole(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/patient');
    }
  };

  return (
    <div className="role-selection-page">
      <div className="role-container">
        <h1 className="role-title">🏥 Welcome to MediSlot</h1>
        <p className="role-subtitle">Healthcare Appointment & Triage System</p>

        <div className="role-cards">
          <div
            className="role-card admin-card"
            onClick={() => handleSelectRole('admin')}
          >
            <div className="role-icon">👨‍💼</div>
            <h2>Admin</h2>
            <p>Manage clinics, doctors, and appointments</p>
            <button className="btn btn-primary">
              Enter as Admin
            </button>
          </div>

          <div
            className="role-card patient-card"
            onClick={() => handleSelectRole('patient')}
          >
            <div className="role-icon">👤</div>
            <h2>Patient</h2>
            <p>Browse doctors and book appointments</p>
            <button className="btn btn-primary">
              Enter as Patient
            </button>
          </div>
        </div>

        <div className="role-info">
          <h3>Key Features:</h3>
          <ul>
            <li>✅ Multi-clinic appointment management</li>
            <li>✅ Triage-based priority system</li>
            <li>✅ Concurrent booking safety (no overbooking)</li>
            <li>✅ Real-time slot availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
