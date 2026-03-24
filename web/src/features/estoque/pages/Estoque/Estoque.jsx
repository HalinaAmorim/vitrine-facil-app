import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import BottomNav from "../../../../components/layout/BottomNav/BottomNav.jsx";
import TopHeader from "../../../../components/layout/TopHeader/TopHeader.jsx";
import ProductModal from "../../../../components/UI/ProductModal/ProductModal.jsx";
import { useAuth } from "../../../../features/auth/context/AuthContext.jsx";
import { api } from "../../../../infra/http/api.js";
import { uploadProdutoImagem } from "../../../../infra/storage/storage.js";


import EstoqueStats from "../../components/EstoqueStats/EstoqueStats.jsx";
import ProdutoCard from "../../../produtos/components/ProdutoCard/ProdutoCard.jsx";
import "./Estoque.css";

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

function getStockStatus(prod) {
  if (Number(prod.estoque) <= 0) return "sem";
  if (Number(prod.estoque) < Number(prod.min || 0)) return "baixo";
  return "ok";
}

export default function Estoque() {
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || null;

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [nivel, setNivel] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  async function carregarProdutos() {
    if (!userId) return setProducts([]);
    try {
      const data = await api.getProdutos(userId);
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, [userId]);

  const stats = useMemo(() => ({
    total: products.length,
    valorEstoque: products.reduce((acc, p) => acc + Number(p.estoque || 0) * Number(p.custo || 0), 0),
    baixo: products.filter((p) => getStockStatus(p) === "baixo").length,
    sem: products.filter((p) => getStockStatus(p) === "sem").length,
  }), [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.nome || "").toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q));
    }
    if (categoria !== "Todas") list = list.filter((p) => p.categoria === categoria);
    
    if (nivel !== "Todos") {
      list = list.filter((p) => {
        const s = getStockStatus(p);
        if (nivel === "Em estoque") return s === "ok";
        if (nivel === "Estoque baixo") return s === "baixo";
        if (nivel === "Sem estoque") return s === "sem";
        return true;
      });
    }

    if (ordenacao === "nome") list.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (ordenacao === "estoque") list.sort((a, b) => Number(a.estoque || 0) - Number(b.estoque || 0));

    return list;
  }, [products, query, categoria, nivel, ordenacao]);

  async function handleCreateOrUpdateProduct(formProduct) {
    try {
      let imagemFinal = formProduct.imagem || PLACEHOLDER_IMG;
      if (formProduct.imageFile) imagemFinal = await uploadProdutoImagem(formProduct.imageFile, userId);

      const payload = { ...formProduct, imagem: imagemFinal };
      delete payload.imageFile;

      if (editingProduct) {
        await api.updateProduto(editingProduct.id, { ...editingProduct, ...payload });
      } else {
        const safeSku = (formProduct.sku || "").trim() || `SKU-${String(Date.now()).slice(-6)}`;
        await api.addProduto({
          ...payload,
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          sku: safeSku,
          userId,
          createdAt: Date.now(),
        });
      }

      await carregarProdutos();
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error?.message || "Erro ao salvar o produto no Firebase.");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      await api.deleteProduto(id);
      await carregarProdutos();
    }
  }

  return (
    <div className="estoque-page">
      <TopHeader showActions={true} />

      <main className="estoque-content">
        {/* Componente Modular 1 */}
        <EstoqueStats stats={stats} />

        <section className="filters-card">
          <div className="filters-header">
            <div className="filters-title-wrap">
              <Search size={20} />
              <h2>Busca de Produtos</h2>
            </div>
          </div>
          <div className="filters-body">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou SKU..."
              />
            </div>
          </div>
        </section>

        <section className="products-section">
          <h2 className="products-title">Produtos ({filtered.length})</h2>
          <div className="products-list">
            {filtered.length === 0 ? (
              <div className="empty-stock-state">
                <h3>Nenhum produto encontrado</h3>
              </div>
            ) : (
              filtered.map((p) => (
                /* Componente Modular 2 */
                <ProdutoCard 
                  key={p.id} 
                  produto={p} 
                  status={getStockStatus(p)}
                  margem={p.preco > 0 ? ((p.preco - p.custo) / p.preco) * 100 : 0}
                  onEdit={(prod) => { setEditingProduct(prod); setModalOpen(true); }}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <button
        type="button"
        className="fab-btn"
        onClick={() => { setEditingProduct(null); setModalOpen(true); }}
        aria-label="Adicionar Produto"
      >
        <Plus size={22} />
      </button>

      <BottomNav />

      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        onSubmit={handleCreateOrUpdateProduct}
        initialData={editingProduct}
        mode={editingProduct ? "edit" : "create"}
      />
    </div>
  );
}