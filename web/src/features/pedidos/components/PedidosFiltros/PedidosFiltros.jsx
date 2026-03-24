import React from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import './PedidosFiltros.css';

export default function PedidosFiltros({ busca, setBusca, filtroStatus, setFiltroStatus }) {
  return (
    <section className="pedidos-header-section">
      <h1 className="page-title">Histórico de Vendas</h1>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar pelo nome do cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="filtros-rapidos">
        <button
          className={`chip-filtro ${filtroStatus === "Todos" ? "ativo" : ""}`}
          onClick={() => setFiltroStatus("Todos")}
        >
          Todos
        </button>

        <button
          className={`chip-filtro cancelado ${filtroStatus === "Cancelado" ? "ativo" : ""}`}
          onClick={() => setFiltroStatus("Cancelado")}
        >
          <XCircle size={16} /> Cancelados
        </button>

        <button
          className={`chip-filtro concluido ${filtroStatus === "Concluído" ? "ativo" : ""}`}
          onClick={() => setFiltroStatus("Concluído")}
        >
          <CheckCircle size={16} /> Concluídos
        </button>
      </div>
    </section>
  );
}