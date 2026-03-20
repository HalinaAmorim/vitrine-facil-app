import React from 'react';
import { Pencil } from 'lucide-react';
import './TopHeaderEditButton.css';

export default function TopHeaderEditButton({ onClick }) {
  return (
    <button 
      className="btn-edit-logo" 
      onClick={onClick}
      title="Editar dados da loja"
    >
      <Pencil size={14} />
      <span>Editar Loja</span>
    </button>
  );
}