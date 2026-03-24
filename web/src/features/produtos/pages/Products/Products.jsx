import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../features/auth/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../infra/http/api.js";

import Input from "../../../../components/UI/Input/Input.jsx";
import Button from "../../../../components/UI/Button/Button.jsx";
import ErrorMessage from "../../../../components/UI/ErrorMessage/ErrorMessage.jsx";
import ProductModal from "../../../../components/UI/ProductModal/ProductModal.jsx"; 
import ProductMiniCard from "../../components/ProdutoMiniCard/ProdutoMiniCard.jsx";
import ImageUploader from "../../components/ImageUploader/ImageUploader.jsx";

import "./Products.css";

function toNumber(value) { return Number(String(value || "").replace(",", ".")) || 0; }

export default function Products() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.idUsuario || user?.id || user?.sub || null;

  const [produtos, setProdutos] = useState([]);
  
  
  const [nome, setNome] = useState("");
  const [sku, setSku] = useState("");
  const [preco, setPreco] = useState("");
  const [custo, setCusto] = useState("");
  const [estoque, setEstoque] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function carregarProdutosAtualizados() {
    if (!userId) return setProdutos([]);
    try {
      const data = await api.getProdutos(userId);
      setProdutos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Erro ao carregar os produtos.");
    }
  }

  useEffect(() => { carregarProdutosAtualizados(); }, [userId]);

  function validate() {
    if (!userId) return "Faça login novamente.";
    if (!nome.trim()) return "Informe o nome.";
    if (!preco) return "Informe o preço de venda.";
    if (!custo) return "Informe o custo.";
    return "";
  }

  async function addProduto(e) {
    e.preventDefault();
    setError(""); setOk("");
    
    const msg = validate();
    if (msg) return setError(msg);

    try {
      setIsLoading(true);
      const novo = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        userId,
        nome: nome.trim(),
        sku: sku.trim() || `SKU-${String(Date.now()).slice(-6)}`,
        categoria: "Sem categoria",
        fornecedor: "Não informado",
        preco: toNumber(preco),
        custo: toNumber(custo),
        estoque: Number(estoque || 0),
        min: Number(min || 0),
        max: Number(max || 0),
        descricao: descricao.trim(),
        imagem: imgUrl || "https://placehold.net/200x200.png",
        createdAt: Date.now(),
      };

      await api.addProduto(novo);
      await carregarProdutosAtualizados();

      
      setNome(""); setSku(""); setPreco(""); setCusto("");
      setEstoque(""); setMin(""); setMax(""); setDescricao(""); setImgUrl("");
      setOk("Produto salvo com sucesso!");
      
      setTimeout(() => setOk(""), 3000);
    } catch (err) {
      setError(err?.message || "Erro ao salvar o produto.");
    } finally {
      setIsLoading(false);
    }
  }

  async function salvarEdicao(payload) {
    try {
      await api.updateProduto(payload.id, payload);
      await carregarProdutosAtualizados();
      setModalOpen(false);
      setEditingProduct(null);
      setOk("Produto atualizado com sucesso!");
    } catch (err) {
      setError(err?.message || "Erro ao atualizar o produto.");
    }
  }

  async function remover(id) {
    if (!window.confirm("Remover este produto?")) return;
    try {
      await api.deleteProduto(id);
      await carregarProdutosAtualizados();
    } catch (err) {
      setError("Erro ao remover o produto.");
    }
  }

  return (
    <div className="products-page">
      <div className="products-center">
        <div className="products-card">
          <h1 className="products-title">Cadastrar produtos</h1>
          <p className="products-subtitle">Preencha os dados completos do produto para integrar com o estoque.</p>

          <ErrorMessage message={error} />
          {ok && <div className="products-alert-success" style={{ padding: '10px', borderRadius: '10px', marginTop: '14px' }}>{ok}</div>}

          <form className="products-form" onSubmit={addProduto}>
            <div className="products-grid-2">
              <Input label="Nome" id="nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do produto" error={!!error && !nome} />
              <Input label="SKU" id="sku" value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU do produto" />
            </div>

            <label className="products-label" style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800 }}>Descrição</span>
              <textarea className="products-textarea" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva o produto" />
            </label>

            <div className="products-grid-2">
              <Input label="Venda (R$)" id="preco" value={preco} onChange={e => setPreco(e.target.value)} placeholder="0,00" error={!!error && !preco} />
              <Input label="Custo (R$)" id="custo" value={custo} onChange={e => setCusto(e.target.value)} placeholder="0,00" error={!!error && !custo} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 18 }}>
              <Input label="Estoque Atual" type="number" id="estoque" value={estoque} onChange={e => setEstoque(e.target.value)} placeholder="0" />
              <Input label="Estoque Mínimo" type="number" id="min" value={min} onChange={e => setMin(e.target.value)} placeholder="0" />
              <Input label="Estoque Máximo" type="number" id="max" value={max} onChange={e => setMax(e.target.value)} placeholder="0" />
            </div>

            <ImageUploader imageUrl={imgUrl} onImageSelected={setImgUrl} onError={setError} title="Escolher imagem" />

            <div className="products-actions">
              <Button type="submit" isLoading={isLoading}>Salvar produto</Button>
              <button type="button" className="products-secondary-btn" onClick={() => navigate("/dashboard")}>
                Pular por enquanto / Ir ao Painel
              </button>
            </div>
          </form>

          <div className="products-list-wrap">
            {produtos.length === 0 ? (
              <p className="products-empty">Nenhum produto cadastrado ainda.</p>
            ) : (
              produtos.map((p) => (
                <ProductMiniCard 
                  key={p.id} 
                  produto={p} 
                  onEdit={(prod) => { setEditingProduct(prod); setModalOpen(true); }} 
                  onRemove={remover} 
                />
              ))
            )}
          </div>
        </div>
      </div>

      
      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        onSubmit={salvarEdicao}
        initialData={editingProduct}
        mode="edit"
      />
    </div>
  );
}