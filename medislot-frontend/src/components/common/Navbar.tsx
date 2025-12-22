import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './navbar.css';

export function Navbar() {
  const { role, setRole } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🏥 MediSlot</h1>
          <p className="navbar-subtitle">Healthcare Appointment & Triage System</p>
        </div>

        {role && (
          <div className="navbar-right">
            <span className="role-badge">
              {role === 'admin' ? '👨‍💼 Admin' : '👤 Patient'}
            </span>
            <button
              className="logout-btn"
              onClick={() => setRole(null)}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
