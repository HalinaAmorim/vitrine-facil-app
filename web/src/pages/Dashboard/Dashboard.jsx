import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, Package, QrCode, ShoppingCart, TrendingUp } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";

import GraficoVendas from "../../components/GraficoVendas/GraficoVendas.jsx";
import "./Dashboard.css";
import BottomNav from "../../components/Layouts/BottomNav/BottomNav.jsx";
import TopHeader from "../../components/Layouts/TopHeader/TopHeader.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || null;

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [prods, peds] = await Promise.all([
          api.getProdutos(userId),
          api.getPedidos(userId)
        ]);
        setProdutos(prods || []);
        setPedidos(peds || []);
      } catch (error) {
        console.error("Erro ao carregar dados do Dashboard", error);
      }
    }
    if (userId) carregarDados();
  }, [userId]);

  
    const { receitaHoje, lucroHoje, vendasDeHojeCount } = useMemo(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const vendasHoje = pedidos.filter((p) => String(p.data || "").startsWith(hoje));
    
    const receita = vendasHoje.reduce((acc, p) => acc + Number(p.total || 0), 0);
    const lucro = vendasHoje.reduce((accPedido, pedido) => {
      const lucroDoPedido = (pedido.itens || []).reduce((accItem, item) => {
        const margem = Number(item.preco || 0) - Number(item.custo || 0);
        return accItem + margem * Number(item.qtd || 0);
      }, 0);
      return accPedido + lucroDoPedido;
    }, 0);

    return { receitaHoje: receita, lucroHoje: lucro, vendasDeHojeCount: vendasHoje.length };
  }, [pedidos]);

  const { ultimos5Dias, maiorVenda, temVendasNaSemana } = useMemo(() => {
    const ultimosDias = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (4 - i));
      const dataStr = d.toISOString().split("T")[0];
      const nomeDia = i === 4 ? "Hoje" : d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
      
      const totalDia = pedidos
        .filter((p) => String(p.data || "").startsWith(dataStr))
        .reduce((acc, p) => acc + Number(p.total || 0), 0);
        
      return { label: nomeDia, total: totalDia, isToday: i === 4 };
    });

    const maior = Math.max(...ultimosDias.map((d) => d.total), 0);
    return { ultimos5Dias: ultimosDias, maiorVenda: maior, temVendasNaSemana: maior > 0 };
  }, [pedidos]);

  const totalProdutos = produtos.length;

  return (
    <div className="dashboard-layout">
      <TopHeader showActions={false} subtitle="Dashboard do vendedor" />

      <main className="main-content">
        
        {/* SECÇÃO 1: Resumo (Cards) */}
        <section className="dashboard-section">
          <h2 className="section-title">Resumo de Hoje</h2>
          <div className="insights-grid">
            <div className="insight-card highlight-green">
              <div className="insight-header">
                <DollarSign size={16} /> <span>Entrou Hoje</span>
              </div>
              <div className="insight-value">R$ {receitaHoje.toFixed(2).replace(".", ",")}</div>
              <div className="insight-trend">
                <span>{vendasDeHojeCount} venda(s) realizada(s)</span>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <TrendingUp size={16} className="text-green" /> <span className="text-green">Seu Lucro</span>
              </div>
              <div className="insight-value text-green">R$ {lucroHoje.toFixed(2).replace(".", ",")}</div>
              <div className="insight-trend"><span>Margem calculada dos custos</span></div>
            </div>
          </div>
        </section>

        {/* SECÇÃO 2: Gráfico Modularizado */}
        <GraficoVendas 
          ultimos5Dias={ultimos5Dias} 
          maiorVenda={maiorVenda} 
          temVendasNaSemana={temVendasNaSemana} 
        />

        {/* SECÇÃO 3: Ações Rápidas */}
        <section className="dashboard-section">
          <div className="actions-grid">
            <button className="action-card primary-action" type="button" onClick={() => navigate("/caixa")}>
              <ShoppingCart size={34} className="action-icon text-white" />
              <span className="action-title text-green">Nova Venda</span>
            </button>
            <button className="action-card" type="button" onClick={() => navigate("/")}>
              <QrCode size={34} className="action-icon text-green" />
              <span className="action-title">Escanear</span>
            </button>
          </div>
        </section>

        {/* SECÇÃO 4: Status do Catálogo */}
        <section className="dashboard-section">
          <h2 className="section-title flex-align">
            <Package size={18} className="text-orange" /> Status do Catálogo
          </h2>
          <div className="alert-list">
            <div className="alert-item" style={{ borderLeftColor: totalProdutos > 0 ? "#0A7B6C" : "#f59e0b" }}>
              <div className="alert-content">
                <span className="product-name">
                  {totalProdutos === 0 ? "Seu catálogo está vazio." : `Você possui ${totalProdutos} produto(s) cadastrado(s).`}
                </span>
              </div>
              <button
                type="button"
                className={`stock-badge ${totalProdutos > 0 ? "ready" : "danger"}`}
                onClick={() => navigate("/estoque")}
              >
                {totalProdutos === 0 ? "Adicionar" : "Ver Estoque"}
              </button>
            </div>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}