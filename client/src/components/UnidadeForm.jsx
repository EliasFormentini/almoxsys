import { useEffect, useState } from "react";
import { salvarUnidade, atualizarUnidade } from "../services/unidadeService";

const UnidadeForm = ({ onSubmit, unidade, cancelarEdicao }) => {
  const [sigla, setSigla] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (unidade) {
      setSigla(unidade.sigla);
      setDescricao(unidade.descricao);
    } else {
      setSigla("");
      setDescricao("");
    }
  }, [unidade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (unidade) {
        await atualizarUnidade(unidade.id, { sigla, descricao });
        alert("Unidade atualizada com sucesso!");
      } else {
        await salvarUnidade({ sigla, descricao });
        alert("Unidade salva com sucesso!");
      }
      if (onSubmit) onSubmit(); // recarregar lista
      setSigla("");
      setDescricao("");
    } catch (err) {
      console.error("Erro ao salvar unidade:", err);
      alert("Erro ao salvar unidade");
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
