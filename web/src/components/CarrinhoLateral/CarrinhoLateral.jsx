import React from 'react';
import { Minus, Plus, ShoppingCart, Trash2, User } from 'lucide-react'; 
import './CarrinhoLateral.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

export default function CarrinhoLateral({
  carrinho,
  totalCarrinho,
  nomeCliente,
  setNomeCliente,
  telefoneCliente,
  setTelefoneCliente,
  alterarQuantidade,
  removerDoCarrinho,
  finalizarVenda,
  isSubmitting
}) {
  return (
    <aside className="checkout-section">
      <div className="carrinho-panel card-panel">
        <h2 className="panel-title">
          <ShoppingCart size={20} /> Carrinho ({carrinho.reduce((a, b) => a + (b.qtd || 0), 0)})
        </h2>

        <div className="carrinho-items">
          {carrinho.length === 0 ? (
            <div className="carrinho-vazio">
              <ShoppingCart size={48} className="icon-vazio" />
              <p>Carrinho vazio</p>
            </div>
          ) : (
            carrinho.map((item) => (
              <div key={item.id} className="carrinho-item">
                <div className="item-info">
                  <h4>{item.nome}</h4>
                  <span>
                    R$ {(Number(item.preco || 0) * Number(item.qtd || 0)).toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="item-controls">
                  <button type="button" onClick={() => alterarQuantidade(item.id, -1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.qtd}</span>
                  <button type="button" onClick={() => alterarQuantidade(item.id, 1)}>
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-lixeira"
                    onClick={() => removerDoCarrinho(item.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {carrinho.length > 0 && (
          <div className="carrinho-footer">
            <div className="total-row">
              <span>Total</span>
              <strong>R$ {totalCarrinho.toFixed(2).replace(".", ",")}</strong>
            </div>

            <Button onClick={finalizarVenda} isLoading={isSubmitting}>
              Finalizar Venda
            </Button>
          </div>
        )}
      </div>

      <div className="cliente-panel card-panel">
        <h2 className="panel-title">
          <User size={20} /> Cliente (Opcional)
        </h2>
        
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <Input
            id="nomeCliente"
            type="text"
            placeholder="Nome do cliente"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
          />
          <Input
            id="telefoneCliente"
            type="tel"
            placeholder="Número de telefone"
            value={telefoneCliente}
            onChange={(e) => setTelefoneCliente(e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}