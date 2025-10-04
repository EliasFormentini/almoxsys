import React, { useEffect, useState } from "react";
import CategoriaForm from "../components/CategoriaForm";
import CategoriaList from "../components/CategoriaList";
import { listarCategorias, deletarCategoria } from "../services/categoriaService";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const carregarCategorias = async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const categoriasFiltradas = (() => {
    const termo = filtro.toString().trim().toLowerCase();
    if (!termo) return categorias;

    return categorias.filter((cat) => {
      const id = cat?.id ? String(cat.id) : "";
      const nome = cat?.nome ? String(cat.nome).toLowerCase() : "";
      const descricao = cat?.descricao ? String(cat.descricao).toLowerCase() : "";
      return id.includes(termo) || nome.includes(termo) || descricao.includes(termo);
    });
  })();

  const handleEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarModal(true);
  };

  const handleNovo = () => {
    setCategoriaEditando(null);
    setMostrarModal(true);
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setCategoriaEditando(null);
  };

  const handleAtualizarLista = () => {
    carregarCategorias();
    handleFecharModal();
  };

  return (
    <div className="container">
      <h2>Categorias</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Filtrar por código ou descrição..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleNovo}>Novo</button>
      </div>

      <CategoriaList
        categorias={categoriasFiltradas}
        onEdit={handleEditar}
        onAtualizar={handleAtualizarLista}
        onDelete={deletarCategoria}
      />

      {mostrarModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>{categoriaEditando ? "Editar Categoria" : "Nova Categoria"}</h3>
            <CategoriaForm
              categoria={categoriaEditando}
              onCancel={handleFecharModal}
              onSuccess={handleAtualizarLista}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
};

export default CategoriasPage;
