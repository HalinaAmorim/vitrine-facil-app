import React from 'react';
import { LayoutDashboard, Search } from 'lucide-react';

import "./ProdutoGrid.css";

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

export default function ProdutoGrid({
  produtosFiltrados,
  categorias,
  categoriaAtiva,
  setCategoriaAtiva,
  busca,
  setBusca,
  adicionarAoCarrinho,
  carrinho
}) {
  return (
    <section className="produtos-section">
      <div className="filtros-container card-panel">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar Produtos"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="categorias-chips">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip-btn ${categoriaAtiva === cat ? "active" : ""}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {categoriaAtiva === cat && <LayoutDashboard size={14} />} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="produtos-grid">
        {produtosFiltrados.length === 0 ? (
          <div className="empty-state">Nenhum produto encontrado.</div>
        ) : (
          produtosFiltrados.map((p) => {
            const itemNoCarrinho = carrinho.find((item) => item.id === p.id);
            const qtdCarrinho = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

            return (
              <button
                key={p.id}
                type="button"
                className="produto-card"
                onClick={() => adicionarAoCarrinho(p)}
                disabled={(p.estoque || 0) <= 0}
                style={{ opacity: (p.estoque || 0) <= 0 ? 0.5 : 1 }}
              >
                {qtdCarrinho > 0 && (
                  <span className="produto-badge-qtd">{qtdCarrinho}</span>
                )}

                <img
                  src={p.imagem || PLACEHOLDER_IMG}
                  alt={p.nome}
                  className="produto-img"
                />

                <h3 className="produto-nome">{p.nome}</h3>

                <strong className="produto-preco">
                  R$ {Number(p.preco || 0).toFixed(2).replace(".", ",")}
                </strong>

                <span
                  className="produto-estoque"
                  style={{
                    color: (p.estoque || 0) <= 0 ? "var(--vf-red)" : "inherit",
                  }}
                >
                  Estoque: {p.estoque || 0}
                </span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}