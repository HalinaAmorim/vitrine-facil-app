import React from 'react';
import { Search, Compass } from 'lucide-react';
import './VitrineSearch.css';

export default function VitrineSearch({ busca, setBusca, segmentos, segmentoAtivo, setSegmentoAtivo }) {
  return (
    <div className="search-container pop-in">
      <div className="search-box">
        <Search className="search-icon" size={22} />
        <input 
          type="text" 
          placeholder="O que você está procurando hoje?" 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="chips-container scrollbar-hide">
        <Compass size={20} className="chip-icon" />
        {segmentos.map((seg) => (
          <button
            key={seg}
            onClick={() => setSegmentoAtivo(seg)}
            className={`segmento-chip ${segmentoAtivo === seg ? "ativo" : ""}`}
          >
            {seg}
          </button>
        ))}
      </div>
    </div>
  );
}