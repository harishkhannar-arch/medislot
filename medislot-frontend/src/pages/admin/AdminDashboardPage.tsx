import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import '../pages.css';

export interface AdminStats {
  clinics: number;
  doctors: number;
  appointments: number;
  availableSlots: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medislot-api.onrender.com';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-dashboard-page">
      <h1>📊 Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h3>Clinics</h3>
              <p className="stat-number">{stats.clinics}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <h3>Doctors</h3>
              <p className="stat-number">{stats.doctors}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Appointments</h3>
              <p className="stat-number">{stats.appointments}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Available Slots</h3>
              <p className="stat-number">{stats.availableSlots}</p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button
            className="action-btn"
            onClick={() => navigate('/admin/clinics')}
          >
            <span className="action-icon">🏥</span>
            <span>Manage Clinics</span>
          </button>

          <button
            className="action-btn"
            onClick={() => navigate('/admin/doctors')}
          >
            <span className="action-icon">👨‍⚕️</span>
            <span>Manage Doctors</span>
          </button>

          <button
            className="action-btn"
            onClick={() => navigate('/admin/slots')}
          >
            <span className="action-icon">🕐</span>
            <span>Manage Slots</span>
          </button>
        </div>
      </div>
    </div>
  );
}
