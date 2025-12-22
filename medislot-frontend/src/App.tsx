import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';

// Pages
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { PatientHomePage } from './pages/patient/PatientHomePage';
import { BookingPage } from './pages/patient/BookingPage';
import { BookingSuccessPage } from './pages/patient/BookingSuccessPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminClinicPage } from './pages/admin/AdminClinicPage';
import { AdminDoctorPage } from './pages/admin/AdminDoctorPage';
import { AdminSlotsPage } from './pages/admin/AdminSlotsPage';

import './App.css';

function AppContent() {
  const { role, isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          {/* Public route - role selection */}
          <Route path="/" element={<RoleSelectionPage />} />

          {/* Patient routes */}
          <Route
            path="/patient"
            element={
              isAuthenticated && role === 'patient' ? (
                <PatientHomePage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/book/:doctorId"
            element={
              isAuthenticated && role === 'patient' ? (
                <BookingPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/booking-success"
            element={
              isAuthenticated && role === 'patient' ? (
                <BookingSuccessPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              isAuthenticated && role === 'admin' ? (
                <AdminDashboardPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/clinics"
            element={
              isAuthenticated && role === 'admin' ? (
                <AdminClinicPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/doctors"
            element={
              isAuthenticated && role === 'admin' ? (
                <AdminDoctorPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/slots"
            element={
              isAuthenticated && role === 'admin' ? (
                <AdminSlotsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
