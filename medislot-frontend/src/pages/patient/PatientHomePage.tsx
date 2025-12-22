import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doctor } from '../../types/doctor';
import { DoctorCard } from '../../components/doctor/DoctorCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DoctorService } from '../../services/doctor.service';
import '../pages.css';

export function PatientHomePage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await DoctorService.getAllDoctors();
        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Failed to load doctors. Please try again.');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialization.toLowerCase().includes(filter.toLowerCase()) ||
    doctor.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectDoctor = (doctor: Doctor) => {
    navigate(`/book/${doctor.id}`, { state: { doctor } });
  };

  return (
    <div className="patient-home-page">
      <div className="page-header">
        <h1>👨‍⚕️ Available Doctors</h1>
        <p>Select a doctor to book an appointment</p>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading doctors..." />
      ) : (
        <>
          <div className="filter-section">
            <input
              type="text"
              placeholder="Filter by name or specialization..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-input"
            />
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onSelect={handleSelectDoctor}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No doctors found. Try adjusting your filter.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
