import React from 'react';

export function FormGroup({ children, className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      {children}
    </div>
  );
}

export function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  className = '',
  error = ''
}) {
  return (
    <FormGroup>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      {error && <span className="error-text">{error}</span>}
    </FormGroup>
  );
}

export function FormSelect({
  id,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  className = '',
  error = '',
  placeholder = 'Select an option'
}) {
  return (
    <FormGroup>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        className={`select ${error ? 'select-error' : ''} ${className}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-text">{error}</span>}
    </FormGroup>
  );
}

export function FormTextarea({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  error = ''
}) {
  return (
    <FormGroup>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        className={`textarea ${error ? 'textarea-error' : ''} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
      />
      {error && <span className="error-text">{error}</span>}
    </FormGroup>
  );
}
