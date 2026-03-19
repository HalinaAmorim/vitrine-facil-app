import { Package, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";


import BottomNav from "../../components/Layouts/BottomNav/BottomNav.jsx";
import TopHeader from "../../components/Layouts/TopHeader/TopHeader.jsx";


import "./Pedidos.css";
import PedidoCard from "../../components/PedidoCard/PedidoCard.jsx";
import PedidosFiltros from "../../components/PedidosFiltros/PedidosFiltros.jsx";

export default function Pedidos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || "anon";

  const [pedidos, setPedidos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

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
      const statusAtual = p.status || "Concluído";
      const matchStatus = filtroStatus === "Todos" || statusAtual === filtroStatus;

      return matchBusca && matchStatus;
    });
  }, [pedidos, busca, filtroStatus]);

  async function marcarComoCancelado(pedido) {
    try {
      const pedidoAtualizado = { ...pedido, status: "Cancelado" };
      await api.updatePedido(pedido.id, pedidoAtualizado);
      setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? pedidoAtualizado : p)));
    } catch (err) {
      alert("Erro ao atualizar o status do pedido.");
    }
  }

  return (
    <div className="pedidos-page">
      <TopHeader showActions={true} />

      <main className="pedidos-content">
        
        {/* Componente Modular 1: Filtros e Busca */}
        <PedidosFiltros 
          busca={busca} 
          setBusca={setBusca} 
          filtroStatus={filtroStatus} 
          setFiltroStatus={setFiltroStatus} 
        />

        {/* Listagem de Pedidos */}
        <section className="pedidos-lista">
          {pedidosFiltrados.length === 0 ? (
            <div className="empty-state">
              <Package size={48} className="empty-icon" />
              <p>Nenhum pedido encontrado aqui.</p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => (
              /* Componente Modular 2: Card de Pedido */
              <PedidoCard 
                key={pedido.id} 
                pedido={pedido} 
                onCancelar={marcarComoCancelado} 
              />
            ))
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