import React, { useEffect, useState } from "react";
import { criarCategoria, atualizarCategoria } from "../services/categoriaService";

const CategoriaForm = ({ categoria, onCancel, onSuccess }) => {
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (categoria) setNome(categoria.nome || "");
  }, [categoria]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoria) {
        await atualizarCategoria(categoria.id, { nome });
      } else {
        await criarCategoria({ nome });
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "10px" }}>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ width: "100%", padding: "6px" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ backgroundColor: "#ccc", border: "none", padding: "6px 12px", borderRadius: "4px" }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{ backgroundColor: "#4CAF50", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px" }}
        >
          {categoria ? "Atualizar" : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default CategoriaForm;
