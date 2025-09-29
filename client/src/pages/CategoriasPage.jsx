import { useEffect, useState } from "react";
import api from "../services/api";
import CategoriaForm from "../components/CategoriaForm";
import CategoriaList from "../components/CategoriaList";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(null); // categoria em edição

  // Carrega categorias ao montar
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  const salvarCategoria = async (categoria) => {
    try {
      if (editando) {
        await api.put(`/categorias/${editando.id}`, categoria);
      } else {
        await api.post("/categorias", categoria);
      }
      fetchCategorias();
      setEditando(null);
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
    }
  };

  const excluirCategoria = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      await api.delete(`/categorias/${id}`);
      fetchCategorias();
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
    }
  };

  return (
    <div>
      <h2>Gestão de Categorias</h2>
      <CategoriaForm
        onSubmit={salvarCategoria}
        categoria={editando}
        cancelarEdicao={() => setEditando(null)}
      />
      <CategoriaList
        categorias={categorias}
        onEdit={setEditando}
        onDelete={excluirCategoria}
      />
    </div>
  );
};

export default CategoriasPage;
