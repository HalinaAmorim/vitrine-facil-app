import React from 'react';
import './ProdutoMiniCard.css';

const PLACEHOLDER_IMG = "https://placehold.net/200x200.png";

function formatPrice(v) {
  return Number(v || 0).toFixed(2).replace(".", ",");
}

export default function ProductMiniCard({ produto, onEdit, onRemove }) {
  return (
    <div className="product-mini-card">
      <div className="product-mini-thumb">
        <img
          src={produto.imagem || PLACEHOLDER_IMG}
          alt={produto.nome || "Produto"}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
        />
      </div>

      <div className="product-mini-info">
        <div className="product-mini-name">{produto.nome}</div>
        {produto.descricao && <div className="product-mini-desc">{produto.descricao}</div>}
        <div className="product-mini-meta">
          SKU: {produto.sku || "Sem SKU"} | Estoque: {Number(produto.estoque || 0)}
        </div>
        <div className="product-mini-meta">
          Mín: {Number(produto.min || 0)} | Máx: {Number(produto.max || 0)}
        </div>
        <div className="product-mini-price">
          Venda: R$ {formatPrice(produto.preco)} | Custo: R$ {formatPrice(produto.custo)}
        </div>
      </div>

      <div className="product-mini-actions">
        <button type="button" className="products-secondary-btn" onClick={() => onEdit(produto)}>
          Editar
        </button>
        <button className="product-mini-remove" type="button" onClick={() => onRemove(produto.id)}>
          Remover
        </button>
      </div>
    </div>
  );
}