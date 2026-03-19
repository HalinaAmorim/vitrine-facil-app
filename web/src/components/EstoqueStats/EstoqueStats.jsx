import React from 'react';
import './EstoqueStats.css';

const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));

export default function EstoqueStats({ stats }) {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Produtos</div>
      </div>
      <div className="stat-card">
        <div className="stat-value value-money">
          {brl(stats.valorEstoque)}
        </div>
        <div className="stat-label">Valor em estoque</div>
      </div>
      <div className="stat-card">
        <div className="stat-value value-warning">{stats.baixo}</div>
        <div className="stat-label">Baixo estoque</div>
      </div>
      <div className="stat-card">
        <div className="stat-value value-danger">{stats.sem}</div>
        <div className="stat-label">Sem estoque</div>
      </div>
    </section>
  );
}