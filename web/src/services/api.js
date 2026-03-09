const API_URL = "http://localhost:3001";

export const api = {
  // --- PRODUTOS ---
  getProdutos: async (userId) => {
    const res = await fetch(`${API_URL}/produtos?userId=${userId}`);
    return res.json();
  },
  addProduto: async (produto) => {
    const res = await fetch(`${API_URL}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });
    return res.json();
  },
  updateProduto: async (id, produto) => {
    const res = await fetch(`${API_URL}/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });
    return res.json();
  },
  deleteProduto: async (id) => {
    await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" });
  },

  // --- PEDIDOS (VENDAS) ---
  getPedidos: async (userId) => {
    const res = await fetch(`${API_URL}/pedidos?userId=${userId}`);
    return res.json();
  },
  addPedido: async (pedido) => {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });
    return res.json();
  },
  updatePedido: async (id, pedido) => {
    const res = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });
    return res.json();
  },
};
