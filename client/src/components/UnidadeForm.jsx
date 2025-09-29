import { useEffect, useState } from "react";
import { salvarUnidade } from "../services/unidadeService"; // ajuste o import conforme sua estrutura

const UnidadeForm = ({ onSubmit, unidade, cancelarEdicao }) => {
  const [sigla, setSigla] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (unidade) {
      setSigla(unidade.sigla || "");
      setDescricao(unidade.descricao || "");
    } else {
      setSigla("");
      setDescricao("");
    }
  }, [unidade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const novaUnidade = { sigla, descricao };
      await salvarUnidade(novaUnidade);
      alert("Unidade salva com sucesso!");
      if (onSubmit) onSubmit(novaUnidade);
      setSigla("");
      setDescricao("");
    } catch (err) {
      console.error("Erro ao salvar unidade:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Sigla (ex: Kg, L, CX...)"
        value={sigla}
        onChange={(e) => setSigla(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <input
        type="text"
        placeholder="Descrição (ex: Quilograma, Litro, Caixa...)"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button type="submit" style={{ padding: "8px 12px" }}>
        {unidade ? "Atualizar" : "Adicionar"}
      </button>
      {unidade && (
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

export default UnidadeForm;
