import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  User,
  LayoutDashboard,
  QrCode,
  Package,
  Store,
  Bell,
  Printer,
  Settings,
  ChevronRight,
  Plus,
} from "lucide-react";
import "./Pedidos.css";
import BottomNav from "../../components/Layouts/BottomNav/BottomNav.jsx";
import TopHeader from "../../components/Layouts/TopHeader/TopHeader.jsx";

export default function Pedidos() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";
  const userInitials = user?.nome ? user.nome.substring(0, 2).toUpperCase() : "VF";
  const [showMenu, setShowMenu] = useState(false);

  const [pedidos, setPedidos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos"); // Todos, Cancelado, Concluído

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const data = await api.getPedidos(userId);
        const ordenados = data.sort((a, b) => new Date(b.data) - new Date(a.data));
        setPedidos(ordenados);
      } catch (err) {
        console.error("Erro ao carregar pedidos", err);
      }
    }
    carregarPedidos();
  }, [userId]);

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const nomeCliente = p.cliente?.nome?.toLowerCase() || "cliente balcão";
      const matchBusca = nomeCliente.includes(busca.toLowerCase());

      // Agora o padrão é Concluído, não Pendente
      const statusAtual = p.status || "Concluído";
      const matchStatus = filtroStatus === "Todos" || statusAtual === filtroStatus;

      return matchBusca && matchStatus;
    });
  }, [pedidos, busca, filtroStatus]);

  async function marcarComoCancelado(pedido) {
    try {
      const pedidoAtualizado = { ...pedido, status: "Cancelado" };
      await api.updatePedido(pedido.id, pedidoAtualizado);

      setPedidos((prev) =>
        prev.map((p) => (p.id === pedido.id ? pedidoAtualizado : p))
      );
    } catch (err) {
      alert("Erro ao atualizar o status do pedido.");
    }
  }

  function formatarDataVisivel(dataString) {
    const data = new Date(dataString);
    const hoje = new Date();

    const ehHoje =
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear();

    const horaFormatada = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (ehHoje) return `Hoje, ${horaFormatada}`;
    return `${data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })} às ${horaFormatada}`;
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
    <div className="pedidos-page">
      <TopHeader showActions={true} />

      <main className="pedidos-content">
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

        <section className="pedidos-lista">
          {pedidosFiltrados.length === 0 ? (
            <div className="empty-state">
              <Package size={48} className="empty-icon" />
              <p>Nenhum pedido encontrado aqui.</p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => {
              const status = pedido.status || "Concluído";
              const isConcluido = status === "Concluído";
              const isCancelado = status === "Cancelado";
              const qtdTotalItens = (pedido.itens || []).reduce(
                (acc, item) => acc + (item.qtd || 0),
                0
              );

              return (
                <div
                  key={pedido.id}
                  className={`pedido-card ${
                    isConcluido ? "card-concluido" : isCancelado ? "card-cancelado" : "card-concluido"
                  }`}
                >
                  <div className="pedido-cabecalho">
                    <div className="pedido-data-cliente">
                      <span className="pedido-data">{formatarDataVisivel(pedido.data)}</span>
                      <div className="pedido-cliente">
                        <User size={16} />
                        <strong>{pedido.cliente?.nome || "Cliente Balcão"}</strong>
                      </div>
                    </div>

                    <div className="pedido-total">
                      R$ {Number(pedido.total || 0).toFixed(2).replace(".", ",")}
                    </div>
                  </div>

                  <div className="pedido-resumo">
                    <span className="resumo-texto">
                      {qtdTotalItens} {qtdTotalItens === 1 ? "item" : "itens"} na compra
                    </span>

                    <button className="btn-ver-detalhes">
                      Detalhes <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="pedido-acoes">
                    <div
                      className={`status-badge ${
                        isConcluido
                          ? "status-verde"
                          : isCancelado
                          ? "status-vermelho"
                          : "status-verde"
                      }`}
                    >
                      {isConcluido ? (
                        <CheckCircle size={14} />
                      ) : isCancelado ? (
                        <XCircle size={14} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      {status}
                    </div>

                    {!isCancelado && !isConcluido && (
                      <button
                        className="btn-cancelar"
                        onClick={() => marcarComoCancelado(pedido)}
                      >
                        Marcar como Cancelado
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <button
        className="floating-add-btn"
        type="button"
        onClick={() => navigate("/caixa")}
        aria-label="Nova venda"
      >
        <Plus size={18} />
        <span>Nova venda</span>
      </button>

      <BottomNav />
    </div>
  );
}