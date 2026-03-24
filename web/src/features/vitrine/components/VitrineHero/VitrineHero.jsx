import React from 'react';
import { Sparkles } from 'lucide-react';
import './VitrineHero.css';

export default function VitrineHero() {
  return (
    <section className="hero-section hero-dark-bg">
      <div className="hero-glow-teal"></div>
      <div className="hero-glow-orange"></div>
      
      <div className="hero-content">
        <div className="hero-pill slide-up">
          <Sparkles size={14} className="text-teal-400" />
          <span>Descubra o comércio local</span>
        </div>
        
        <h1 className="hero-title slide-up-delay-1">
          Compre de quem faz a <span className="text-gradient">diferença</span> na sua região.
        </h1>
        
        <p className="hero-subtitle slide-up-delay-2">
          Apoie pequenos empreendedores, encontre produtos únicos e fortaleça a economia do seu bairro.
        </p>
      </div>
    </section>
  );
}