import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "./AuthLayout.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [nome, setNome] = useState(user?.nome || "");
  const [cpf, setCpf] = useState(user?.cpf || "");
  const [segmento, setSegmento] = useState(user?.segmento || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nome.trim()) {
      setError("Informe o nome.");
      return;
    }

    if (!cpf.trim() || String(cpf).replace(/\D/g, "").length !== 11) {
      setError("CPF deve ter 11 dígitos.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ nome: nome.trim(), cpf: cpf.replace(/\D/g, ""), segmento: segmento.trim() });
      setSuccess("Perfil atualizado com sucesso.");
      setTimeout(() => navigate("/home", { replace: true }), 700);
    } catch (err) {
      setError(err.message || "Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Editar Perfil</h1>
        <p className="auth-subtitle">Atualize seus dados de lojista</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nome completo
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required />
          </label>

          <label>
            Email
            <input type="email" value={user?.email || ""} readOnly />
          </label>

          <label>
            CPF
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="00000000000" required />
          </label>

          <label>
            Segmento
            <input type="text" value={segmento} onChange={(e) => setSegmento(e.target.value)} placeholder="Ex: Moda" />
          </label>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Salvar perfil"}
          </button>

          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Voltar
          </button>

          <button type="button" className="btn-link text-red" onClick={handleLogout}>
            Sair da conta
          </button>
        </form>
      </div>
    </div>
  );
}
