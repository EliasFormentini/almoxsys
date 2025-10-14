import React, { useEffect, useState } from "react";
import * as categoriaService from "../services/categoriaService";
import CategoriaModal from "../components/CategoriaModal";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await categoriaService.listar();
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleNova = () => {
    setCategoriaSelecionada(null);
    setIsModalOpen(true);
  };

  const handleEditar = (categoria) => {
    setCategoriaSelecionada(categoria);
    setIsModalOpen(true);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await categoriaService.excluir(id);
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  const handleSalvar = async (categoria) => {
    try {
      if (categoriaSelecionada) {
        await categoriaService.atualizar(categoriaSelecionada.id, { nome: categoria.nome });
      } else {
        await categoriaService.criar({ nome: categoria.nome });
      }
      carregarCategorias();
      setShowModal(false);
      setCategoriaSelecionada(null);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho dinâmico */}
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Categorias</h1>
        <button
          onClick={handleNova}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm"
        >
          Novo
        </button>
      </div>

      {/* Filtro */}
      <div className="mb-4">
        <input

          type="text"
          placeholder="Filtrar por descrição..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 border-b text-left w-24">Código</th>
              <th className="px-4 py-3 border-b text-left">Descrição</th>
              <th className="px-4 py-3 border-b text-center w-48">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((categoria) => (
                <tr
                  key={categoria.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 border-b text-gray-700">{categoria.id}</td>
                  <td className="px-4 py-2 border-b">{categoria.nome}</td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      onClick={() => handleEditar(categoria)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(categoria.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CategoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        categoriaSelecionada={categoriaSelecionada}
      />
    </div>
  );
};

export default CategoriasPage;
