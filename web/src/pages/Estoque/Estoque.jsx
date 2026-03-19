import {
  Pencil,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/Layouts/BottomNav/BottomNav.jsx";
import TopHeader from "../../components/Layouts/TopHeader/TopHeader.jsx";
import ProductModal from "../../components/UI/ProductModal/ProductModal.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";
import { uploadProdutoImagem } from "../../services/storage.js";
import "./Estoque.css";

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

const brl = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(v || 0)
  );

function getStockStatus(prod) {
  if (Number(prod.estoque) <= 0) return "sem";
  if (Number(prod.estoque) < Number(prod.min || 0)) return "baixo";
  return "ok";
}

  <ProductModal/>

export default function Estoque() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || null;
  const userInitials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "VF";
  const [showMenu, setShowMenu] = useState(false);

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [nivel, setNivel] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  async function carregarProdutos() {
    try {
      if (!userId) {
        setProducts([]);
        return;
      }

      const data = await api.getProdutos(userId);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, [userId]);

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(products.map((p) => p.categoria)))],
    [products]
  );

  const stats = useMemo(() => {
    return {
      total: products.length,
      valorEstoque: products.reduce(
        (acc, p) => acc + Number(p.estoque || 0) * Number(p.custo || 0),
        0
      ),
      baixo: products.filter((p) => getStockStatus(p) === "baixo").length,
      sem: products.filter((p) => getStockStatus(p) === "sem").length,
    };
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          (p.nome || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q)
      );
    }

    if (categoria !== "Todas") {
      list = list.filter((p) => p.categoria === categoria);
    }

    if (nivel !== "Todos") {
      list = list.filter((p) => {
        const s = getStockStatus(p);
        if (nivel === "Em estoque") return s === "ok";
        if (nivel === "Estoque baixo") return s === "baixo";
        if (nivel === "Sem estoque") return s === "sem";
        return true;
      });
    }

    if (ordenacao === "nome") {
      list.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordenacao === "estoque") {
      list.sort((a, b) => Number(a.estoque || 0) - Number(b.estoque || 0));
    }

    return list;
  }, [products, query, categoria, nivel, ordenacao]);

  async function handleCreateOrUpdateProduct(formProduct) {
    try {
      let imagemFinal = formProduct.imagem || PLACEHOLDER_IMG;

      if (formProduct.imageFile) {
        imagemFinal = await uploadProdutoImagem(formProduct.imageFile, userId);
      }

      const payload = {
        ...formProduct,
        imagem: imagemFinal,
      };

      delete payload.imageFile;

      if (editingProduct) {
        await api.updateProduto(editingProduct.id, {
          ...editingProduct,
          ...payload,
        });
      } else {
        const safeSku =
          (formProduct.sku || "").trim() || `SKU-${String(Date.now()).slice(-6)}`;

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

  function handleOpenCreate() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function handleOpenEdit(product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingProduct(null);
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="estoque-page">
     <TopHeader showActions={true} />

      <main className="estoque-content">
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

        <section className="filters-card">
          <div className="filters-header">
            <div className="filters-title-wrap">
              <Search size={20} />
              <h2>Busca e Filtros</h2>
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
              filtered.map((p) => {
                const status = getStockStatus(p);
                const margem =
                  p.preco > 0 ? ((p.preco - p.custo) / p.preco) * 100 : 0;

                return (
                  <article
                    key={p.id}
                    className={`product-card stock-${status}`}
                  >
                    <div className="product-main">
                      <div className="product-main-row">
                        <div className="product-thumb">
                          <img src={p.imagem || PLACEHOLDER_IMG} alt={p.nome} />
                        </div>
                        <div className="product-main-text">
                          <h3 className="product-name">{p.nome}</h3>
                          <p className="product-sku">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </div>

                    <div className="product-grid">
                      <div className="product-cell">
                        <span className="cell-label">Estoque</span>
                        <strong>{p.estoque} unidade</strong>
                      </div>
                      <div className="product-cell">
                        <span className="cell-label">Preço</span>
                        <strong>{brl(p.preco)}</strong>
                      </div>
                      <div className="product-cell">
                        <span className="cell-label">Custo</span>
                        <strong>{brl(p.custo)}</strong>
                      </div>
                      <div className="product-cell">
                        <span className="cell-label">Margem</span>
                        <strong className="margem-value">
                          {margem.toFixed(1)}%
                        </strong>
                      </div>
                    </div>

                    <div className="product-side">
                      <div className="product-actions">
                        <button
                          className="btn-outline"
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Pencil size={16} /> Editar
                        </button>
                        <button
                          className="btn-outline-danger"
                          type="button"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={16} /> Excluir
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Botão flutuante (Floating Action Button) */}
      <button
        type="button"
        onClick={handleOpenCreate}
        aria-label="Adicionar Produto"
        style={{
          position: "fixed",
          right: 20,
          bottom: 90,
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a7b6c",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
          cursor: "pointer",
        }}
      >
        <Plus size={22} />
      </button>

      <BottomNav />

      <ProductModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdateProduct}
        initialData={editingProduct}
        mode={editingProduct ? "edit" : "create"}
      />
    </div>
  );
}