import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Doctor } from '../../types/doctor';
import { Slot, BookingRequest } from '../../types/appointment';
import { BookingForm } from '../../components/appointment/BookingForm';
import { SlotCard } from '../../components/appointment/SlotCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast, ToastType } from '../../components/common/Toast';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import '../pages.css';

export function BookingPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const doctorFromState = location.state?.doctor as Doctor | undefined;

  const [doctor, setDoctor] = useState<Doctor | null>(doctorFromState || null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) return;

      try {
        setSlotsLoading(true);
        
        // Fetch doctor if not provided via navigation state
        if (!doctor) {
          const doctorData = await DoctorService.getDoctorById(doctorId);
          setDoctor(doctorData);
        }

        // Fetch available slots
        const slotsData = await DoctorService.getAvailableSlots(doctorId);
        setSlots(slotsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load doctor or slots. Please try again.');
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchData();
  }, [doctorId, doctor]);

  const handleBooking = async (request: BookingRequest) => {
    try {
      setLoading(true);
      const response = await AppointmentService.bookAppointment(request);

      if (response.status === 'CONFIRMED') {
        setToast({
          message: '✅ Appointment booked successfully!',
          type: 'success',
        });

        // Redirect to success page
        setTimeout(() => {
          navigate('/booking-success', {
            state: {
              appointmentId: response.appointmentId,
              slotTime: response.slotTime,
            },
          });
        }, 1500);
      } else {
        // Show failure with suggested slots if CRITICAL
        let message = response.reason || 'Booking failed. Please try again.';
        if (response.suggestedSlots && response.suggestedSlots.length > 0) {
          message +=
            ` Available slots: ${response.suggestedSlots
              .map((s) => new Date(s.start_time).toLocaleTimeString())
              .join(', ')}`;
        }

        setToast({
          message: message,
          type: 'error',
        });

        // Update slots if the one we chose was booked
        if (response.suggestedSlots) {
          setSlots((prev) =>
            prev.map((slot) =>
              response.suggestedSlots?.find((s) => s.id === slot.id)
                ? { ...slot, status: 'BOOKED' }
                : slot
            )
          );
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      setToast({
        message: '❌ An error occurred during booking',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (slotsLoading && !doctor) {
    return <LoadingSpinner message="Loading appointment details..." />;
  }

  if (!doctor) {
    return (
      <div className="error-message">
        <p>Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="booking-container">
        <div className="doctor-summary">
          <h2>👨‍⚕️ {doctor.name}</h2>
          <p>📋 {doctor.specialization}</p>
          <p>🏥 {doctor.clinic_name}</p>
        </div>

        <div className="booking-content">
          <div className="slots-section">
            <h3>🕐 Select a Time Slot</h3>
            {slotsLoading ? (
              <LoadingSpinner message="Loading slots..." />
            ) : slots.length > 0 ? (
              <div className="slots-grid">
                {slots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    selected={selectedSlot?.id === slot.id}
                    onSelect={setSelectedSlot}
                  />
                ))}
              </div>
            ) : (
              <p className="no-slots">No available slots for this doctor</p>
            )}
            {selectedSlot && (
              <p className="selected-info">
                ✓ Selected: {new Date(selectedSlot.start_time).toLocaleString()}
              </p>
            )}
          </div>

          <BookingForm
            doctor={doctor}
            selectedSlot={selectedSlot}
            onSubmit={handleBooking}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
