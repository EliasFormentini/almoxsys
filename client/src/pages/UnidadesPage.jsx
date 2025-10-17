import React, { useEffect, useState } from "react";
import * as unidadeService from "../services/unidadeService";
import UnidadeModal from "../components/UnidadeModal";
import { Pencil, Trash2 } from "lucide-react";

const UnidadesPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    carregarUnidades();
  }, []);

  const carregarUnidades = async () => {
    try {
      const response = await unidadeService.listar();
      setUnidades(response.data);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  };

  const handleNova = () => {
    setUnidadeSelecionada(null);
    setIsModalOpen(true);
  };

  const handleEditar = (unidade) => {
    setUnidadeSelecionada(unidade);
    setIsModalOpen(true);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta unidade?")) return;
    try {
      await unidadeService.deletar(id);
      carregarUnidades();
    } catch (error) {
      console.error("Erro ao excluir unidade:", error);
    }
  };

  const handleSalvar = async (data) => {
    try {
      if (data.id) {
        await unidadeService.atualizar(data.id, {
          descricao: data.descricao,
          sigla: data.sigla,
        });
      } else {
        await unidadeService.criar({
          descricao: data.descricao,
          sigla: data.sigla,
        });
      }
      await carregarUnidades();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar unidade:", err);
      alert("Erro ao salvar unidade");
    }
  };

  const unidadesFiltradas = unidades.filter(
    (u) =>
      u.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.sigla.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.id.toString().includes(termoBusca)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Unidades de Medida</h1>
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
          placeholder="Filtrar por descrição, sigla ou código..."
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
              <th className="px-4 py-3 border-b text-left w-40">Sigla</th>
              <th className="px-4 py-3 border-b text-center w-48">Ações</th>
            </tr>
          </thead>
          <tbody>
            {unidadesFiltradas.length > 0 ? (
              unidadesFiltradas.map((unidade) => (
                <tr key={unidade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 border-b text-gray-700">{unidade.id}</td>
                  <td className="px-4 py-2 border-b">{unidade.descricao}</td>
                  <td className="px-4 py-2 border-b">{unidade.sigla}</td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      onClick={() => handleEditar(unidade)}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded text-sm"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(unidade.id)}
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
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  Nenhuma unidade encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <UnidadeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        unidadeSelecionada={unidadeSelecionada}
      />
    </div>
  );
};

export default UnidadesPage;
