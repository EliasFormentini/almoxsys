import { useEffect, useState } from "react";
import {
  criarUnidade,
  atualizarUnidade,
} from "../services/unidadeService";

const UnidadeForm = ({ unidadeEditando, onClose, onAtualizar }) => {
  const [sigla, setSigla] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (unidadeEditando) {
      setSigla(unidadeEditando.sigla || "");
      setDescricao(unidadeEditando.descricao || "");
    } else {
      setSigla("");
      setDescricao("");
    }
  }, [unidadeEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (unidadeEditando) {
        await atualizarUnidade(unidadeEditando.id, { sigla, descricao });
      } else {
        await criarUnidade({ sigla, descricao });
      }
      onAtualizar();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      alert("Erro ao salvar unidade!");
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h3>{unidadeEditando ? "Editar Unidade" : "Nova Unidade"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Sigla"
            value={sigla}
            onChange={(e) => setSigla(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={buttonGroupStyle}>
            <button type="submit" style={buttonStyle}>
              Salvar
            </button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Estilos inline para a modal ===
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  boxSizing: "border-box",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  backgroundColor: "#ccc",
  color: "#000",
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default UnidadeForm;
