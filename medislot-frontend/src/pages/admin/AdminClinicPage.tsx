import React, { useEffect, useState } from 'react';
import { Clinic } from '../../types/clinic';
import { ClinicService } from '../../services/clinic.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast, ToastType } from '../../components/common/Toast';
import '../pages.css';
import './admin-pages.css';

export function AdminClinicPage() {
  const [clinics, setClinic] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const data = await ClinicService.getAllClinics();
      setClinic(data);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
      setToast({
        message: '❌ Failed to load clinics',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ClinicService.createClinic(formData);
      setToast({
        message: '✅ Clinic created successfully!',
        type: 'success',
      });
      setFormData({ name: '', address: '', phone: '' });
      setFormMode('list');
      fetchClinics();
    } catch (error) {
      console.error('Error creating clinic:', error);
      setToast({
        message: '❌ Failed to create clinic',
        type: 'error',
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClinic) return;

    try {
      await ClinicService.updateClinic(editingClinic.id, formData);
      setToast({
        message: '✅ Clinic updated successfully!',
        type: 'success',
      });
      setFormData({ name: '', address: '', phone: '' });
      setEditingClinic(null);
      setFormMode('list');
      fetchClinics();
    } catch (error) {
      console.error('Error updating clinic:', error);
      setToast({
        message: '❌ Failed to update clinic',
        type: 'error',
      });
    }
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
    });
    setFormMode('edit');
  };

  const handleDelete = async (clinicId: string) => {
    if (!window.confirm('Are you sure you want to delete this clinic?')) return;

    try {
      await ClinicService.deleteClinic(clinicId);
      setToast({
        message: '✅ Clinic deleted successfully!',
        type: 'success',
      });
      fetchClinics();
    } catch (error) {
      console.error('Error deleting clinic:', error);
      setToast({
        message: '❌ Failed to delete clinic',
        type: 'error',
      });
    }
  };

  if (loading && clinics.length === 0) {
    return <LoadingSpinner message="Loading clinics..." />;
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
        <h1>🏥 Manage Clinics</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormMode('create');
            setFormData({ name: '', address: '', phone: '' });
          }}
        >
          + Add Clinic
        </button>
      </div>

      {formMode !== 'list' && (
        <div className="form-container">
          <h2>{formMode === 'create' ? 'Create New Clinic' : 'Edit Clinic'}</h2>
          <form
            onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
            className="admin-form"
          >
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Clinic Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., City Health Clinic"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main Street"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., 9999999999"
                className="form-input"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {formMode === 'create' ? '✅ Create Clinic' : '✅ Update Clinic'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFormMode('list');
                  setEditingClinic(null);
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {formMode === 'list' && (
        <div className="list-container">
          {clinics.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clinics.map((clinic) => (
                    <tr key={clinic.id}>
                      <td>{clinic.name}</td>
                      <td>{clinic.address}</td>
                      <td>{clinic.phone}</td>
                      <td className="action-buttons">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(clinic)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(clinic.id)}
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
            <p className="empty-state">No clinics found. Create one to get started!</p>
          )}
        </div>
      )}
    </div>
  );
}
