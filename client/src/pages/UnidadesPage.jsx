import { useEffect, useState } from "react";
import UnidadeList from "../components/UnidadeList";
import UnidadeForm from "../components/UnidadeForm";
import { listarUnidades } from "../services/unidadeService";

const UnidadesPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState(null);

  const carregarUnidades = async () => {
    try {
      const data = await listarUnidades();
      setUnidades(data);
    } catch (err) {
      console.error("Erro ao carregar unidades:", err);
    }
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  const unidadesFiltradas = unidades.filter(
    (u) =>
      (u.sigla && u.sigla.toLowerCase().includes(filtro.toLowerCase())) ||
      (u.descricao && u.descricao.toLowerCase().includes(filtro.toLowerCase())) ||
      u.id.toString().includes(filtro)
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cadastro de Unidades</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Filtrar por código, sigla ou descrição..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button
          onClick={() => {
            setUnidadeEditando(null);
            setMostrarModal(true);
          }}
          style={{ marginLeft: "10px" }}
        >
          Novo
        </button>
      </div>

      <UnidadeList
        unidades={unidadesFiltradas}
        onEdit={(u) => {
          setUnidadeEditando(u);
          setMostrarModal(true);
        }}
        onAtualizar={carregarUnidades}
      />

      {mostrarModal && (
        <UnidadeForm
          unidadeEditando={unidadeEditando}
          onClose={() => setMostrarModal(false)}
          onAtualizar={carregarUnidades}
        />
      )}
    </div>
  );
};

export default UnidadesPage;
