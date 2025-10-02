import { useEffect, useState } from "react";
import Modal from "react-modal";
import CategoriaForm from "../components/CategoriaForm";
import CategoriaList from "../components/CategoriaList";
import { listarCategorias } from "../services/categoriaService";

// Necessário para acessibilidade do react-modal
Modal.setAppElement("#root");

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalAberta, setModalAberta] = useState(false);

  const carregarCategorias = async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const categoriasFiltradas = categorias.filter((cat) => {
    const termo = filtro.toLowerCase();
    return (
      String(cat.id).includes(termo) ||
      cat.nome.toLowerCase().includes(termo)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestão de Categorias</h2>

      {/* Campo de filtro */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Filtrar por código ou nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Botão Novo */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setModalAberta(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#d9534f",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          NOVO
        </button>
      </div>

      {/* Lista */}
      <CategoriaList categorias={categoriasFiltradas} />

      {/* Modal */}
      <Modal
        isOpen={modalAberta}
        onRequestClose={() => setModalAberta(false)}
        contentLabel="Nova Categoria"
        style={{
          content: {
            width: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <h3>Nova Categoria</h3>
        <CategoriaForm
          onSubmit={() => {
            carregarCategorias();
            setModalAberta(false);
          }}
          cancelarEdicao={() => setModalAberta(false)}
        />
      </Modal>
    </div>
  );
};

export default CategoriasPage;
