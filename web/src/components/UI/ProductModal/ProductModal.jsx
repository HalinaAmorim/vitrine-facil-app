import React, { useState, useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import './ProductModal.css';

const PLACEHOLDER_IMG = "https://placehold.net/600x400.png";

export default function ProductModal({
    open,
    onClose,
    onSubmit,
    initialData = null,
    mode = "create",
  }) {
    const fileInputRef = useRef(null);
  
    const emptyForm = {
      id: null,
      nome: "",
      sku: "",
      descricao: "",
      categoria: "",
      fornecedor: "",
      preco: "",
      custo: "",
      estoque: "",
      min: "",
      max: "",
      imagem: "",
      imageFile: null,
    };
  
    const [form, setForm] = useState(emptyForm);
    const [selectedImageName, setSelectedImageName] = useState("");
  
    useEffect(() => {
      if (!open) return;
  
      if (initialData) {
        setForm({
          id: initialData.id ?? null,
          nome: initialData.nome ?? "",
          sku: initialData.sku ?? "",
          descricao: initialData.descricao ?? "",
          categoria: initialData.categoria ?? "",
          fornecedor: initialData.fornecedor ?? "",
          preco: String(initialData.preco ?? ""),
          custo: String(initialData.custo ?? ""),
          estoque: String(initialData.estoque ?? 0),
          min: String(initialData.min ?? 0),
          max: String(initialData.max ?? 0),
          imagem: initialData.imagem ?? "",
          imageFile: null,
        });
        setSelectedImageName("");
      } else {
        setForm(emptyForm);
        setSelectedImageName("");
      }
    }, [open, initialData]);
  
    const canSubmit = useMemo(
      () =>
        form.nome.trim().length > 0 &&
        form.preco !== "" &&
        form.custo !== "" &&
        Number(form.preco) >= 0 &&
        Number(form.custo) >= 0,
      [form]
    );
  
    if (!open) return null;
  
    function setField(key, value) {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  
    function handleSubmit(e) {
      e.preventDefault();
      if (!canSubmit) return;
  
      onSubmit({
        ...form,
        categoria: form.categoria?.trim() || "Sem categoria",
        fornecedor: form.fornecedor?.trim() || "Não informado",
        preco: Number(form.preco || 0),
        custo: Number(form.custo || 0),
        estoque: Number(form.estoque || 0),
        min: Number(form.min || 0),
        max: Number(form.max || 0),
        imagem: form.imagem || PLACEHOLDER_IMG,
        imageFile: form.imageFile || null,
      });
    }
  
    function onPickImage(file) {
      if (!file) return;
      if (!file.type?.startsWith("image/")) return;
  
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          imagem: String(reader.result || ""),
          imageFile: file,
        }));
        setSelectedImageName(file.name || "imagem selecionada");
      };
      reader.readAsDataURL(file);
    }
  
    const title = mode === "edit" ? "Editar Produto" : "Adicionar Novo Produto";
    const subtitle =
      mode === "edit"
        ? "Atualize as informações do produto"
        : "Adicione um novo produto ao seu estoque";
    const submitLabel =
      mode === "edit" ? "Salvar Alterações" : "Adicionar Produto";
  
    const hasCurrentImage = !!form.imagem;
    const imageStatusText = selectedImageName
      ? `Nova imagem selecionada: ${selectedImageName}`
      : hasCurrentImage
        ? "Imagem atual carregada"
        : "Nenhuma imagem selecionada";
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
            <button className="icon-close" type="button" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="grid-2">
              <label>
                <span>Nome do Produto</span>
                <input
                  autoFocus
                  value={form.nome}
                  onChange={(e) => setField("nome", e.target.value)}
                  placeholder="Ex: Café"
                  required
                />
              </label>
              <label>
                <span>
                  SKU <small>(opcional)</small>
                </span>
                <input
                  value={form.sku}
                  onChange={(e) => setField("sku", e.target.value)}
                />
              </label>
            </div>
  
            <label>
              <span>Descrição</span>
              <textarea
                rows={3}
                value={form.descricao}
                onChange={(e) => setField("descricao", e.target.value)}
              />
            </label>
  
            <div className="grid-2">
              <label>
                <span>Categoria</span>
                <input
                  value={form.categoria}
                  onChange={(e) => setField("categoria", e.target.value)}
                />
              </label>
              <label>
                <span>Fornecedor</span>
                <input
                  value={form.fornecedor}
                  onChange={(e) => setField("fornecedor", e.target.value)}
                />
              </label>
            </div>
  
            <div className="grid-2">
              <label>
                <span>Preço de Venda (R$)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco}
                  onChange={(e) => setField("preco", e.target.value)}
                  required
                />
              </label>
              <label>
                <span>Preço de Custo (R$)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.custo}
                  onChange={(e) => setField("custo", e.target.value)}
                  required
                />
              </label>
            </div>
  
            <div className="stock-group-title">Regras de Estoque</div>
  
            <div className="grid-3">
              <label>
                <span>Estoque Atual</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.estoque}
                  onChange={(e) => setField("estoque", e.target.value)}
                />
              </label>
              <label>
                <span>Mínimo</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.min}
                  onChange={(e) => setField("min", e.target.value)}
                />
              </label>
              <label>
                <span>Máximo</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.max}
                  onChange={(e) => setField("max", e.target.value)}
                />
              </label>
            </div>
  
            <label>
              <span>Imagem do Produto</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => onPickImage(e.target.files?.[0])}
                style={{ display: "none" }}
              />
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  background: "#fff",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "1px solid #d1d5db",
                    background: "#f9fafb",
                    color: "#111827",
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {hasCurrentImage
                    ? "Gostaria de trocar a imagem?"
                    : "Selecionar imagem"}
                </button>
                <span
                  style={{
                    fontSize: 13,
                    color: selectedImageName ? "#0f766e" : "#6b7280",
                    fontWeight: selectedImageName ? 700 : 500,
                    textAlign: "right",
                    flex: 1,
                    minWidth: 180,
                  }}
                >
                  {imageStatusText}
                </span>
              </div>
            </label>
  
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={!canSubmit}>
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }