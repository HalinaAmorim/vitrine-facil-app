import React from 'react';
import './Button.css';

export default function Button({ children, type = "button", isLoading, ...props }) {
  return (
    <button 
      type={type} 
      className="auth-button" 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Aguarde..." : children}
    </button>
  );
}