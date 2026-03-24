import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import './ProdutoCard.css';

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";
const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));

export default function ProdutoCard({ produto, status, margem, onEdit, onDelete }) {
  return (
    <article className={`product-card stock-${status}`}>
      <div className="product-main">
        <div className="product-main-row">
          <div className="product-thumb">
            <img src={produto.imagem || PLACEHOLDER_IMG} alt={produto.nome} />
          </div>
          <div className="product-main-text">
            <h3 className="product-name">{produto.nome}</h3>
            <p className="product-sku">SKU: {produto.sku}</p>
          </div>
        </div>
      </div>

      <div className="product-grid">
        <div className="product-cell">
          <span className="cell-label">Estoque</span>
          <strong>{produto.estoque} un.</strong>
        </div>
        <div className="product-cell">
          <span className="cell-label">Preço</span>
          <strong>{brl(produto.preco)}</strong>
        </div>
        <div className="product-cell">
          <span className="cell-label">Custo</span>
          <strong>{brl(produto.custo)}</strong>
        </div>
        <div className="product-cell">
          <span className="cell-label">Margem</span>
          <strong className="margem-value">{margem.toFixed(1)}%</strong>
        </div>
      </div>

      <div className="product-side">
        <div className="product-actions">
          <button className="btn-outline" type="button" onClick={() => onEdit(produto)}>
            <Pencil size={16} /> Editar
          </button>
          <button className="btn-outline-danger" type="button" onClick={() => onDelete(produto.id)}>
            <Trash2 size={16} /> Excluir
          </button>
        </div>
      </div>
    </article>
  );
}