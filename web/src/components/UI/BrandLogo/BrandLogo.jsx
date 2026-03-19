import React from 'react';
import './BrandLogo.css';

export default function BrandLogo({ title = "VitrineFácil", subtitle }) {
  return (
    <div className="auth-logo">
      <div className="auth-logo-badge">VF</div>
      <div>
        <div className="auth-logo-name">{title}</div>
        {subtitle && <div className="auth-logo-desc">{subtitle}</div>}
      </div>
    </div>
  );
}