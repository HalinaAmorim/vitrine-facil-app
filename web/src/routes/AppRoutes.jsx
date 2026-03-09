import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Auth/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import HomeWelcome from "../pages/Auth/HomeWelcome.jsx";
import Products from "../pages/Products/Products.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Estoque from "../pages/Estoque/Estoque";
import Caixa from "../pages/Caixa/Caixa.jsx";
import Pedidos from "../pages/Pedidos/Pedidos.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<HomeWelcome />} />
      <Route path="/products" element={<Products />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/caixa" element={<Caixa />} />
      <Route path="/pedidos" element={<Pedidos />} />

      {/* ✅ login não existe mais */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
