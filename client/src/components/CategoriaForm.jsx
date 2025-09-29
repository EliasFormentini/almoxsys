import { useEffect, useState } from "react";

const CategoriaForm = ({ onSubmit, categoria, cancelarEdicao }) => {
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome);
    } else {
      setNome("");
    }
  }, [categoria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onSubmit({ nome });
    setNome("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Nome da categoria"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button type="submit" style={{ padding: "8px 12px" }}>
        {categoria ? "Atualizar" : "Adicionar"}
      </button>
      {categoria && (
        <button
          type="button"
          onClick={cancelarEdicao}
          style={{ padding: "8px 12px", marginLeft: "10px" }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
};

export default CategoriaForm;
