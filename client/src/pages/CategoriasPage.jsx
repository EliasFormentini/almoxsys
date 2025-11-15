import React, { useEffect, useState } from "react";
import * as categoriaService from "../services/categoriaService";
import CategoriaModal from "../components/CategoriaModal";
import { Pencil, Trash2 } from "lucide-react";
import { useAlert } from "../hooks/useAlert";
import { useToast } from "../contexts/ToastContext";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");

  const { alert, confirm, AlertComponent } = useAlert();
  const { showToast } = useToast();

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await categoriaService.listar();
      setCategorias(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      showToast({
        type: "error",
        title: "Erro ao carregar",
        message: "Não foi possível carregar as categorias.",
      });
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
    const ok = await confirm({
      title: "Excluir categoria",
      message: "Tem certeza que deseja excluir esta categoria?",
      type: "warning",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
    });

    if (!ok) return;

    try {
      await categoriaService.deletar(id);
      await carregarCategorias();

      showToast({
        type: "success",
        title: "Categoria excluída",
        message: "A categoria foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      await alert({
        title: "Erro ao excluir",
        message:
          error.response?.data?.error ||
          "Não foi possível excluir a categoria. Verifique se ela não está em uso.",
        type: "error",
      });
    }
  };

  const handleSalvar = async (data) => {
    try {
      if (data.id) {
        await categoriaService.atualizar(data.id, { nome: data.nome });
        showToast({
          type: "success",
          title: "Categoria atualizada",
          message: "A categoria foi salva com sucesso.",
        });
      } else {
        await categoriaService.criar({ nome: data.nome });
        showToast({
          type: "success",
          title: "Categoria criada",
          message: "Nova categoria cadastrada com sucesso.",
        });
      }

      await carregarCategorias();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);

      await alert({
        title: "Erro ao salvar categoria",
        message:
          err.response?.data?.error ||
          "Ocorreu um erro ao salvar a categoria. Tente novamente.",
        type: "error",
      });
    }
  };

  const categoriasFiltradas = (categorias || []).filter((c) =>
    (c.nome || "").toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Cabeçalho dinâmico */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-2xl font-semibold text-gray-800">Categorias</h1>
          <button
            onClick={handleNova}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
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
                    <td className="px-4 py-2 border-b text-gray-700">
                      {categoria.id}
                    </td>
                    <td className="px-4 py-2 border-b">{categoria.nome}</td>
                    <td className="px-4 py-2 border-b text-center space-x-2">
                      <button
                        onClick={() => handleEditar(categoria)}
                        className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded text-sm"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleExcluir(categoria.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
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

      {AlertComponent}
    </>
  );
};

export default CategoriasPage;
