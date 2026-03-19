import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  
  return (
    <div className="auth-error" role="alert">
      {message}
    </div>
  );
}