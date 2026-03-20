import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";

import Input from "../../../components/UI/Input/Input.jsx";
import Select from "../../../components/UI/Select/Select.jsx";
import Button from "../../../components/UI/Button/Button.jsx";
import ErrorMessage from "../../../components/UI/ErrorMessage/ErrorMessage.jsx";
import ImageUploader from "../../../components/ImageUploader/ImageUploader.jsx";
import BrandLogo from "../../../components/UI/BrandLogo/BrandLogo.jsx";

const STORE_KEY = "vf_store_profile";

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

function loadStoreProfile(userId) {
  const raw = localStorage.getItem(STORE_KEY);
  const all = safeParse(raw) || {};
  return all[userId] || null;
}

function saveStoreProfile(userId, data) {
  const raw = localStorage.getItem(STORE_KEY);
  const all = safeParse(raw) || {};
  all[userId] = data;
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
}

export default function HomeWelcome({ editMode = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.idUsuario || user?.id || user?.sub || "anon";

  const saved = useMemo(() => loadStoreProfile(userId), [userId]);

  const [fotoUrl, setFotoUrl] = useState(saved?.fotoUrl || "");
  const [nomeLoja, setNomeLoja] = useState(saved?.nomeLoja || "");
  const [endereco, setEndereco] = useState(saved?.endereco || "");
  const [horario, setHorario] = useState(saved?.horario || "");
  const [numeroLoja, setNumeroLoja] = useState(saved?.numeroLoja || "");

  const [fazEntrega, setFazEntrega] = useState(saved?.fazEntrega ?? true);
  const [tempoEntrega, setTempoEntrega] = useState(saved?.tempoEntrega || "");
  const [temEntregador, setTemEntregador] = useState(saved?.temEntregador ?? true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = loadStoreProfile(userId);
    if (s) {
      setFotoUrl(s.fotoUrl || "");
      setNomeLoja(s.nomeLoja || "");
      setEndereco(s.endereco || "");
      setHorario(s.horario || "");
      setNumeroLoja(s.numeroLoja || "");
      setFazEntrega(s.fazEntrega ?? true);
      setTempoEntrega(s.tempoEntrega || "");
      setTemEntregador(s.temEntregador ?? true);
    }
  }, [userId]);

  function validate() {
    setError("");
    if (!nomeLoja.trim()) return "Informe o nome da loja.";
    if (!endereco.trim()) return "Informe o endereço.";
    if (!horario.trim()) return "Informe o horário de funcionamento.";
    if (fazEntrega && !tempoEntrega.trim()) return "Informe o tempo de entrega.";
    return "";
  }

  function onSubmit(e) {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);

    const profile = {
      fotoUrl: fotoUrl || "",
      nomeLoja: nomeLoja.trim(),
      endereco: endereco.trim(),
      horario: horario.trim(),
      numeroLoja: numeroLoja.trim(),
      fazEntrega: !!fazEntrega,
      tempoEntrega: fazEntrega ? tempoEntrega.trim() : "",
      temEntregador: fazEntrega ? !!temEntregador : false,
      updatedAt: Date.now(),
    };

    saveStoreProfile(userId, profile);

    setTimeout(() => {
      setLoading(false);
      navigate(editMode ? "/dashboard" : "/products");
    }, 600);
  }

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        {/* Componente Modular da Logo */}
        <BrandLogo subtitle={editMode ? "Edite seu perfil" : "Continue fazendo seu perfil"} />
      </div>

      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-title">{editMode ? "Editar perfil da loja" : "Sua vitrine"}</h1>
          <p className="auth-subtitle">{editMode ? "Atualize suas informações." : "Essas informações vão aparecer para os clientes."}</p>

          {/* Mensagem de Erro Padronizada */}
          <ErrorMessage message={error} />

          <form className="auth-form" onSubmit={onSubmit}>
            
            <ImageUploader 
              imageUrl={fotoUrl} 
              onImageSelected={setFotoUrl} 
              onError={setError} 
            />

            <Input 
              label="Nome da loja"
              id="nomeLoja"
              value={nomeLoja}
              onChange={(e) => setNomeLoja(e.target.value)}
              placeholder="Ex: Loja da Ana"
              error={!!error && !nomeLoja.trim()}
            />

            <Input 
              label="Endereço"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              error={!!error && !endereco.trim()}
            />

            <Input 
              label="Número da loja (opcional)"
              id="numeroLoja"
              value={numeroLoja}
              onChange={(e) => setNumeroLoja(e.target.value)}
              placeholder="Ex: 12B"
            />

            <Input 
              label="Horário de funcionamento"
              id="horario"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              placeholder="Ex: Seg–Sáb 08:00–18:00"
              error={!!error && !horario.trim()}
            />

            <Select 
              label="Tem condições de fazer entrega?"
              id="fazEntrega"
              value={fazEntrega ? "sim" : "nao"}
              onChange={(e) => {
                const yes = e.target.value === "sim";
                setFazEntrega(yes);
                if (!yes) {
                  setTempoEntrega("");
                  setTemEntregador(false);
                }
              }}
            >
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </Select>

            {fazEntrega && (
              <>
                <Input 
                  label="Tempo de entrega estimado"
                  id="tempoEntrega"
                  value={tempoEntrega}
                  onChange={(e) => setTempoEntrega(e.target.value)}
                  placeholder="Ex: 30–45 min"
                  error={!!error && fazEntrega && !tempoEntrega.trim()}
                />

                <Select 
                  label="Possui entregador próprio?"
                  id="temEntregador"
                  value={temEntregador ? "sim" : "nao"}
                  onChange={(e) => setTemEntregador(e.target.value === "sim")}
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </Select>
              </>
            )}

            {/* Botão Padronizado com Loading */}
            <Button type="submit" isLoading={loading}>
              {editMode ? "Salvar alterações" : "Salvar e continuar"}
            </Button>

            <p className="auth-footer" style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => navigate(editMode ? "/dashboard" : "/")}
                style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", color: "var(--vf-primary)", fontWeight: 900 }}
              >
                {editMode ? "Voltar para o painel" : "Cancelar e ir para o início"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}