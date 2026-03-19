import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, QrCode, Package, Store } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${isActive('/dashboard')}`} 
        type="button" 
        onClick={() => navigate("/dashboard")}
      >
        <div className="nav-icon-wrap"><LayoutDashboard size={22} /></div>
        <span>Início</span>
      </button>

      <button 
        className={`nav-item ${isActive('/pedidos')}`} 
        type="button" 
        onClick={() => navigate("/pedidos")}
      >
        <div className="nav-icon-wrap"><QrCode size={22} /></div>
        <span>Pedidos</span>
      </button>

      <button 
        className={`nav-item ${isActive('/estoque')}`} 
        type="button" 
        onClick={() => navigate("/estoque")}
      >
        <div className="nav-icon-wrap"><Package size={22} /></div>
        <span>Estoque</span>
      </button>

      <button 
        className={`nav-item ${isActive('/caixa')}`} 
        type="button" 
        onClick={() => navigate("/caixa")}
      >
        <div className="nav-icon-wrap"><Store size={22} /></div>
        <span>Caixa</span>
      </button>
    </nav>
  );
}