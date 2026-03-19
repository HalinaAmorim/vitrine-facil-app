import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store as StoreIcon } from 'lucide-react';
import { firebaseService } from '../../services/firebase';

import VitrineHero from '../../components/VitrineHero/VitrineHero.jsx';
import VitrineSearch from '../../components/VitrineSearch/VitrineSearch.jsx';
import LojaCard from '../../components/LojaCard/LojaCard.jsx';
import './Vitrine.css';

const PLACEHOLDER_COVER = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export default function Vitrine() {
  const navigate = useNavigate();
  const [lojas, setLojas] = useState([]);
  const [busca, setBusca] = useState("");
  const [segmentoAtivo, setSegmentoAtivo] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarLojas() {
      setLoading(true);
      const dados = await firebaseService.getLojas();
      
      const lojasFormatadas = dados.map(loja => ({
        ...loja,
        image: loja.imagemCapa || PLACEHOLDER_COVER,
        rating: 4.8, 
        reviews: Math.floor(Math.random() * 100) + 10,
        location: loja.cidade || "Centro",
      }));
      
      setLojas(lojasFormatadas);
      setLoading(false);
    }
    carregarLojas();
  }, []);

  const segmentos = useMemo(() => {
    const segs = new Set(lojas.map(loja => loja.segmento || "Outros"));
    return ["Todos", ...Array.from(segs)];
  }, [lojas]);

  const lojasFiltradas = useMemo(() => {
    return lojas.filter(loja => {
      const matchBusca = (loja.nomeLoja || loja.nome || "").toLowerCase().includes(busca.toLowerCase());
      const matchSegmento = segmentoAtivo === "Todos" || (loja.segmento || "Outros") === segmentoAtivo;
      return matchBusca && matchSegmento;
    });
  }, [lojas, busca, segmentoAtivo]);

  return (
    <div className="vitrine-page fade-in">
      
      <header className="vitrine-header glass-effect">
        <div className="vitrine-logo">
          <div className="logo-badge-modern">VF</div>
          <span className="logo-text-modern">
            Vitrine<span className="text-orange-modern">Fácil</span>
          </span>
        </div>
        <button className="btn-lojista-outline" onClick={() => navigate('/login')}>
          Sou Lojista
        </button>
      </header>

      <main className="vitrine-main">
        <VitrineHero />

        <VitrineSearch 
          busca={busca} 
          setBusca={setBusca} 
          segmentos={segmentos} 
          segmentoAtivo={segmentoAtivo} 
          setSegmentoAtivo={setSegmentoAtivo} 
        />

        <section className="resultados-section">
          <div className="resultados-header">
            <h2>{busca ? "Resultados da busca" : "Lojas em destaque"}</h2>
            <p>{lojasFiltradas.length} {lojasFiltradas.length === 1 ? 'loja encontrada' : 'lojas encontradas'}</p>
          </div>

          {loading ? (
            <div className="lojas-grid skeleton-grid">
              {/* Esqueleto de Loading Omitido por brevidade visual */}
              <p>Carregando lojas...</p>
            </div>
          ) : lojasFiltradas.length === 0 ? (
            <div className="empty-state pop-in">
              <div className="empty-icon-wrap"><StoreIcon size={40} /></div>
              <h3>Nenhuma loja encontrada</h3>
              <p>Não encontramos resultados para "{busca}". Tente buscar com outros termos.</p>
              <button onClick={() => { setBusca(""); setSegmentoAtivo("Todos"); }}>Limpar filtros</button>
            </div>
          ) : (
            <div className="lojas-grid">
              {lojasFiltradas.map((loja, index) => (
                <LojaCard key={loja.id} loja={loja} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}