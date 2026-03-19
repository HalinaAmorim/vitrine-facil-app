import React from 'react';
import './Input.css';

export default function Input({ label, id, error, ...props }) {
  return (
    <label className="auth-label" htmlFor={id}>
      {label}
      <input 
        id={id} 
        className={`auth-input ${error ? 'input-error' : ''}`} 
        {...props} 
      />
    </label>
  );
}