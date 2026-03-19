import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import BrandLogo from "../../../components/UI/BrandLogo/BrandLogo.jsx";
import "./AuthLayout.css";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const loc = useLocation();

  
  if (isAuthenticated && (loc.pathname === "/login" || loc.pathname === "/cadastro")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">
      
      <div className="auth-topbar">
        <BrandLogo subtitle="Acesse sua conta com segurança" />
      </div>

      
      <div className="auth-center">
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}