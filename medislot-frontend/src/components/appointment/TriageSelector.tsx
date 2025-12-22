import React from 'react';
import { TriageLevel } from '../../types/appointment';
import { TRIAGE_LEVELS, TRIAGE_COLORS, TRIAGE_LABELS } from '../../utils/constants';
import './triage.css';

interface TriageSelectorProps {
  selected: TriageLevel;
  onSelect: (level: TriageLevel) => void;
}

export function TriageSelector({ selected, onSelect }: TriageSelectorProps) {
  const levels: TriageLevel[] = ['CRITICAL', 'HIGH', 'NORMAL'];

  return (
    <div className="triage-selector">
      <label className="form-label">Urgency Level *</label>
      <div className="triage-options">
        {levels.map((level) => (
          <div key={level} className="triage-option">
            <input
              type="radio"
              id={`triage-${level}`}
              name="triage-level"
              value={level}
              checked={selected === level}
              onChange={() => onSelect(level)}
            />
            <label
              htmlFor={`triage-${level}`}
              className="triage-label"
              style={{
                borderColor: TRIAGE_COLORS[level],
                backgroundColor:
                  selected === level
                    ? `${TRIAGE_COLORS[level]}15`
                    : 'transparent',
              }}
            >
              <span className="triage-text">{TRIAGE_LABELS[level]}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
