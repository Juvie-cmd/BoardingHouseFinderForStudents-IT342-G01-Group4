import React from 'react';

export function ToggleSwitch({ checked = false, onChange, disabled = false }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="toggle-slider"></span>
    </label>
  );
}
