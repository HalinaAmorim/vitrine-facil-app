import React from 'react';
import './ImageUploader.css';

export default function ImageUploader({ 
  imageUrl, 
  onImageSelected, 
  onError, 
  id = "image-upload",
  placeholderImg = "https://placehold.net/200x200.png",
  title = "Adicionar imagem",
  subtitle = "PNG ou JPG."
}) {
  
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (onError) onError("");

    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      if (onError) onError("Selecione uma imagem válida (PNG/JPG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onImageSelected(String(reader.result || ""));
    reader.onerror = () => { if (onError) onError("Não foi possível ler a imagem."); };
    reader.readAsDataURL(file);
  }

  return (
    <div className="upload-row">
      <div className="upload-preview">
        <img src={imageUrl || placeholderImg} alt="Preview da imagem" />
      </div>

      <div className="upload-box">
        <input
          id={id}
          className="upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label className="upload-label" htmlFor={id}>
          <div className="upload-plus">+</div>
          <div className="upload-text">
            <b>{title}</b>
            <small>{subtitle}</small>
          </div>
        </label>
      </div>
    </div>
  );
}