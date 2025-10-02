import { useState } from "react";
import { salvarCategoria } from "../services/categoriaService";

const CategoriaForm = ({ onSubmit, cancelarEdicao }) => {
  const [nome, setNome] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salvarCategoria({ nome });
      onSubmit(); // chama callback passado pela modal
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome da categoria"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={cancelarEdicao}
          style={{ marginRight: "10px" }}
        >
          Cancelar
        </button>
        <button type="submit" style={{ backgroundColor: "#5cb85c", color: "#fff", padding: "8px 12px", border: "none", borderRadius: "4px" }}>
          Salvar
        </button>
      </div>
    </form>
  );
};

export default CategoriaForm;
