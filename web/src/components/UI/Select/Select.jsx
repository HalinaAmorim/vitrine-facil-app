import React from 'react';
import '../Input/Input.css'; 

export default function Select({ label, id, error, children, ...props }) {
  return (
    <label className="auth-label" htmlFor={id}>
      {label}
      <select 
        id={id} 
        className={`auth-input ${error ? 'input-error' : ''}`} 
        {...props}
      >
        {children}
      </select>
    </label>
  );
}