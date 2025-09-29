import { useEffect, useState } from "react";
import api from "../services/api";
import UnidadeForm from "../components/UnidadeForm";
import UnidadeList from "../components/UnidadeList";

const UnidadesPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    try {
      const res = await api.get("/unidades");
      setUnidades(res.data);
    } catch (err) {
      console.error("Erro ao buscar unidades:", err);
    }
  };

  const salvarUnidade = async (unidade) => {
    try {
      if (editando) {
        await api.put(`/unidades/${editando.id}`, unidade);
      } else {
        await api.post("/unidades", unidade);
      }
      fetchUnidades();
      setEditando(null);
    } catch (err) {
      console.error("Erro ao salvar unidade:", err);
    }
  };

  const excluirUnidade = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      await api.delete(`/unidades/${id}`);
      fetchUnidades();
    } catch (err) {
      console.error("Erro ao excluir unidade:", err);
    }
  };

  return (
    <div>
      <h2>Gestão de Unidades</h2>
      <UnidadeForm
        onSubmit={salvarUnidade}
        unidade={editando}
        cancelarEdicao={() => setEditando(null)}
      />
      <UnidadeList
        unidades={unidades}
        onEdit={setEditando}
        onDelete={excluirUnidade}
      />
    </div>
  );
};

export default UnidadesPage;
