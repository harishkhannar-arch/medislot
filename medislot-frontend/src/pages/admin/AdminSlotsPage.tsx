import React, { useEffect, useState } from 'react';
import { Doctor } from '../../types/doctor';
import { Slot } from '../../types/appointment';
import { DoctorService } from '../../services/doctor.service';
import { SlotService } from '../../services/slot.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast, ToastType } from '../../components/common/Toast';
import '../pages.css';
import './admin-pages.css';

export function AdminSlotsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [formData, setFormData] = useState({
    doctor_id: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      fetchSlots(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await DoctorService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setToast({
        message: '❌ Failed to load doctors',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (doctorId: string) => {
    try {
      const data = await SlotService.getSlotsByDoctor(doctorId);
      setSlots(data);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setToast({
        message: '❌ Failed to load slots',
        type: 'error',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SlotService.createSlot({
        doctor_id: selectedDoctorId || formData.doctor_id,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });
      setToast({
        message: '✅ Slot created successfully!',
        type: 'success',
      });
      resetForm();
      if (selectedDoctorId) {
        fetchSlots(selectedDoctorId);
      }
    } catch (error) {
      console.error('Error creating slot:', error);
      setToast({
        message: '❌ Failed to create slot',
        type: 'error',
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    try {
      await SlotService.updateSlot(editingSlot.id, {
        doctor_id: editingSlot.doctor_id,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });
      setToast({
        message: '✅ Slot updated successfully!',
        type: 'success',
      });
      resetForm();
      if (selectedDoctorId) {
        fetchSlots(selectedDoctorId);
      }
    } catch (error) {
      console.error('Error updating slot:', error);
      setToast({
        message: '❌ Failed to update slot',
        type: 'error',
      });
    }
  };

  const handleEdit = (slot: Slot) => {
    setEditingSlot(slot);
    setFormData({
      doctor_id: slot.doctor_id,
      start_time: slot.start_time.slice(0, 16), // Format for datetime-local input
      end_time: slot.end_time.slice(0, 16),
    });
    setFormMode('edit');
  };

  const handleDelete = async (slotId: string) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      await SlotService.deleteSlot(slotId);
      setToast({
        message: '✅ Slot deleted successfully!',
        type: 'success',
      });
      if (selectedDoctorId) {
        fetchSlots(selectedDoctorId);
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      setToast({
        message: '❌ Failed to delete slot',
        type: 'error',
      });
    }
  };

  const resetForm = () => {
    setFormData({ doctor_id: '', start_time: '', end_time: '' });
    setEditingSlot(null);
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
        <h1>🕐 Manage Slots</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormMode('create');
            setFormData({ doctor_id: selectedDoctorId, start_time: '', end_time: '' });
          }}
          disabled={!selectedDoctorId && formMode === 'list'}
        >
          + Add Slot
        </button>
      </div>

      <div className="filter-section">
        <label htmlFor="doctor-select" className="form-label">
          Select Doctor *
        </label>
        <select
          id="doctor-select"
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="form-input"
        >
          <option value="">Choose a doctor...</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialization} ({doctor.clinic_name})
            </option>
          ))}
        </select>
      </div>

      {formMode !== 'list' && (
        <div className="form-container">
          <h2>{formMode === 'create' ? 'Create New Slot' : 'Edit Slot'}</h2>
          <form
            onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
            className="admin-form"
          >
            {formMode === 'create' && (
              <div className="form-group">
                <label htmlFor="doctor_id_form" className="form-label">
                  Doctor *
                </label>
                <select
                  id="doctor_id_form"
                  name="doctor_id"
                  value={formData.doctor_id || selectedDoctorId}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="start_time" className="form-label">
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_time" className="form-label">
                End Time *
              </label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {formMode === 'create' ? '✅ Create Slot' : '✅ Update Slot'}
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

      {formMode === 'list' && selectedDoctorId && (
        <div className="list-container">
          {slots.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot.id}>
                      <td>{new Date(slot.start_time).toLocaleString()}</td>
                      <td>{new Date(slot.end_time).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${slot.status.toLowerCase()}`}>
                          {slot.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(slot)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(slot.id)}
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
            <p className="empty-state">No slots found for this doctor. Create one to get started!</p>
          )}
        </div>
      )}

      {formMode === 'list' && !selectedDoctorId && (
        <p className="empty-state">Select a doctor to manage their slots</p>
      )}
    </div>
  );
}
