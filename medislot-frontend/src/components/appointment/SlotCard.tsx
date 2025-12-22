import React from 'react';
import { Slot } from '../../types/appointment';
import './slot.css';

interface SlotCardProps {
  slot: Slot;
  selected: boolean;
  onSelect: (slot: Slot) => void;
}

export function SlotCard({ slot, selected, onSelect }: SlotCardProps) {
  const startTime = new Date(slot.start_time).toLocaleString('en-IN', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`slot-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(slot)}
    >
      <div className="slot-time">
        <span className="time-icon">🕐</span>
        <span className="time-text">{startTime}</span>
      </div>
      <span className={`slot-status ${slot.status.toLowerCase()}`}>
        {slot.status === 'AVAILABLE' ? '✓ Available' : '✗ Booked'}
      </span>
    </div>
  );
}
