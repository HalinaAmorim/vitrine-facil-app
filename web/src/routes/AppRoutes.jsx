import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";


import AuthLayout from "../pages/Auth/Layout/AuthLayout.jsx";
import HomeWelcome from "../pages/Auth/Profile/HomeWelcome.jsx";
import Register from "../pages/Auth/Register.jsx";


import Caixa from "../pages/Caixa/Caixa.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Estoque from "../pages/Estoque/Estoque.jsx";
import Pedidos from "../pages/Pedidos/Pedidos.jsx";
import Products from "../pages/Products/Products.jsx";


import Login from "../pages/Auth/Login.jsx";
import Vitrine from "../pages/Vitrine/Vitrine.jsx";

function LoadingWithLogo() {
  return (
    <div className="loading-screen">
      <div className="logo-container loading-logo-container">
        <div className="logo-badge">VF</div>
        <div className="logo-text-wrap">
          <span className="logo-text">Vitrine<span className="text-orange">Fácil</span></span>
          <span className="logo-subtext">Carregando...</span>
        </div>
      </div>
    </div>
  );
}

function PageLoader({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 280);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return <LoadingWithLogo />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingWithLogo />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <PageLoader>{children}</PageLoader>;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingWithLogo />;
  }

  if (isAuthenticated) {
    // Se já estiver logado, manda para o dashboard em vez de ver o login novamente
    return <Navigate to="/dashboard" replace />; 
  }

  return <PageLoader>{children}</PageLoader>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🌍 ROTA PRINCIPAL (VITRINE PÚBLICA) */}
      <Route path="/" element={<PageLoader><Vitrine /></PageLoader>} />

      {/* 🔐 ROTAS DE AUTENTICAÇÃO (ENVOLVIDAS NO LAYOUT E NO PUBLIC ROUTE) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      </Route>

      {/* 🛡️ ROTAS INTERNAS PROTEGIDAS (SÓ PARA QUEM FEZ LOGIN) */}
      <Route path="/home" element={<ProtectedRoute><HomeWelcome /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><HomeWelcome editMode /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
      <Route path="/caixa" element={<ProtectedRoute><Caixa /></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />

      {/* 🚧 ROTA DE SEGURANÇA (Fallback) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}