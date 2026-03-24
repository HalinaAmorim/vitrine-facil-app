import React from 'react';
import { MapPin, User, Star, ArrowRight } from 'lucide-react';
import './LojaCard.css';

export default function LojaCard({ loja, index }) {
  return (
    <article 
      className="loja-modern-card pop-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="card-cover">
        <img src={loja.image} alt={loja.nomeLoja} />
        <div className="card-cover-overlay"></div>
        <div className="card-rating">
          <Star size={12} className="star-icon" />
          {loja.rating}
          <span>({loja.reviews})</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-avatar-row">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(loja.nomeLoja)}&background=0A7B6C&color=fff&size=120&bold=true`}
            alt={`${loja.nomeLoja} logo`}
            className="loja-avatar-float"
          />
          <span className="loja-tag">{loja.segmento}</span>
        </div>

        <h3 className="loja-title">{loja.nomeLoja}</h3>

        <div className="loja-meta">
          <div className="meta-item">
            <MapPin size={14} /> <span>{loja.location}</span>
          </div>
          <div className="meta-item">
            <User size={14} /> <span>Por {loja.nome}</span>
          </div>
        </div>

        <button className="btn-catalogo" onClick={() => alert(`Em breve: Catálogo de ${loja.nomeLoja}`)}>
          <span>Ver Catálogo</span>
          <div className="btn-catalogo-icon">
            <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </article>
  );
}