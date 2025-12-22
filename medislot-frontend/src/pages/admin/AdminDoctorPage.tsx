import React, { useEffect, useState } from 'react';
import { Doctor } from '../../types/doctor';
import { Clinic } from '../../types/clinic';
import { DoctorService } from '../../services/doctor.service';
import { ClinicService } from '../../services/clinic.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast, ToastType } from '../../components/common/Toast';
import { SPECIALIZATIONS } from '../../utils/constants';
import '../pages.css';
import './admin-pages.css';

export function AdminDoctorPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [formData, setFormData] = useState({
    clinic_id: '',
    name: '',
    specialization: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsData, clinicsData] = await Promise.all([
        DoctorService.getAllDoctors(),
        ClinicService.getAllClinics(),
      ]);
      setDoctors(doctorsData);
      setClinics(clinicsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setToast({
        message: '❌ Failed to load data',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await DoctorService.createDoctor({
        clinic_id: formData.clinic_id,
        name: formData.name,
        specialization: formData.specialization,
        email: formData.email,
        phone: formData.phone,
      });
      setToast({
        message: '✅ Doctor created successfully!',
        type: 'success',
      });
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating doctor:', error);
      setToast({
        message: '❌ Failed to create doctor',
        type: 'error',
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      await DoctorService.updateDoctor(editingDoctor.id, formData);
      setToast({
        message: '✅ Doctor updated successfully!',
        type: 'success',
      });
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error updating doctor:', error);
      setToast({
        message: '❌ Failed to update doctor',
        type: 'error',
      });
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      clinic_id: doctor.clinic_id,
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone || '',
    });
    setFormMode('edit');
  };

  const handleDelete = async (doctorId: string) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await DoctorService.deleteDoctor(doctorId);
      setToast({
        message: '✅ Doctor deleted successfully!',
        type: 'success',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setToast({
        message: '❌ Failed to delete doctor',
        type: 'error',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      clinic_id: '',
      name: '',
      specialization: '',
      email: '',
      phone: '',
    });
    setEditingDoctor(null);
    setFormMode('list');
  };

  if (loading) {
    return <LoadingSpinner message="Loading doctors..." />;
  }

  return (
    <div className="admin-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <h1>👨‍⚕️ Manage Doctors</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormMode('create');
            setFormData({ clinic_id: '', name: '', specialization: '', email: '', phone: '' });
          }}
        >
          + Add Doctor
        </button>
      </div>

      {formMode !== 'list' && (
        <div className="form-container">
          <h2>{formMode === 'create' ? 'Create New Doctor' : 'Edit Doctor'}</h2>
          <form
            onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
            className="admin-form"
          >
            <div className="form-group">
              <label htmlFor="clinic_id" className="form-label">
                Clinic *
              </label>
              <select
                id="clinic_id"
                name="clinic_id"
                value={formData.clinic_id}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select a clinic</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Doctor Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Dr. John Smith"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization" className="form-label">
                Specialization *
              </label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="doctor@example.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="9999999999"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {formMode === 'create' ? '✅ Create Doctor' : '✅ Update Doctor'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {formMode === 'list' && (
        <div className="list-container">
          {doctors.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Clinic</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.clinic_name || 'N/A'}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.phone || 'N/A'}</td>
                      <td className="action-buttons">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(doctor)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(doctor.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No doctors found. Create one to get started!</p>
          )}
        </div>
      )}
    </div>
  );
}
