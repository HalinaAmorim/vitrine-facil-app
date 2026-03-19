import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { api } from "../../services/api.js";


import BottomNav from "../../components/Layouts/BottomNav/BottomNav.jsx";
import TopHeader from "../../components/Layouts/TopHeader/TopHeader.jsx";

import "./Caixa.css";
import ProdutoGrid from "../../components/ProdutoGrid/ProdutoGrid.jsx";
import CarrinhoLateral from "../../components/CarrinhoLateral/CarrinhoLateral.jsx";


export default function Caixa() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.idUsuario || user?.id || user?.sub || null;

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  
  const [carrinho, setCarrinho] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProdutos(userId);
        setProdutos(data || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }
    if (userId) load();
  }, [userId]);

  const categorias = useMemo(() => {
    const cats = new Set(produtos.map((p) => p.categoria || "Sem categoria"));
    return ["Todos", ...Array.from(cats)];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchBusca = (p.nome || "").toLowerCase().includes(busca.toLowerCase());
      const matchCat = categoriaAtiva === "Todos" || (p.categoria || "Sem categoria") === categoriaAtiva;
      return matchBusca && matchCat;
    });
  }, [produtos, busca, categoriaAtiva]);

  function adicionarAoCarrinho(produto) {
    if ((produto.estoque || 0) <= 0) {
      alert("Produto sem estoque!");
      return;
    }
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      if (existe) {
        if (existe.qtd >= (produto.estoque || 0)) {
          alert("Estoque insuficiente!");
          return prev;
        }
        return prev.map((item) => item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item);
      }
      return [...prev, { ...produto, qtd: 1 }];
    });
  }

  function alterarQuantidade(id, delta) {
    setCarrinho((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const prodDb = produtos.find((p) => p.id === id);
        const novaQtd = item.qtd + delta;
        if (novaQtd > (prodDb?.estoque || 0)) {
          alert("Estoque máximo atingido!");
          return item;
        }
        return { ...item, qtd: novaQtd };
      }).filter((item) => item.qtd > 0)
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  }

  const totalCarrinho = carrinho.reduce((acc, item) => acc + Number(item.preco || 0) * Number(item.qtd || 0), 0);

  async function finalizarVenda() {
    if (carrinho.length === 0) return alert("Adicione produtos ao carrinho.");

    try {
      setIsSubmitting(true);
      await api.finalizarVenda({
        userId,
        carrinho,
        nomeCliente,
        telefoneCliente,
        totalCarrinho,
        status: "Concluído",
        data: new Date().toISOString(),
      });

      alert(`Venda finalizada com sucesso!\nTotal: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`);

      setCarrinho([]);
      setNomeCliente("");
      setTelefoneCliente("");

      const atualizados = await api.getProdutos(userId);
      setProdutos(atualizados || []);

    } catch (err) {
      console.error(err);
      alert(err?.message || "Erro ao finalizar venda.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="caixa-page">
      <TopHeader showActions={true} />

      <main className="caixa-content">
        <ProdutoGrid 
          produtosFiltrados={produtosFiltrados}
          categorias={categorias}
          categoriaAtiva={categoriaAtiva}
          setCategoriaAtiva={setCategoriaAtiva}
          busca={busca}
          setBusca={setBusca}
          adicionarAoCarrinho={adicionarAoCarrinho}
          carrinho={carrinho}
        />

        <CarrinhoLateral 
          carrinho={carrinho}
          totalCarrinho={totalCarrinho}
          nomeCliente={nomeCliente}
          setNomeCliente={setNomeCliente}
          telefoneCliente={telefoneCliente}
          setTelefoneCliente={setTelefoneCliente}
          alterarQuantidade={alterarQuantidade}
          removerDoCarrinho={removerDoCarrinho}
          finalizarVenda={finalizarVenda}
          isSubmitting={isSubmitting}
        />
      </main>

      <BottomNav />
    </div>
  );
}