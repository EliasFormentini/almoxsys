import React, { useEffect, useMemo, useState } from "react";
import * as fornecedorService from "../services/fornecedorService";
import FornecedorModal from "../components/FornecedorModal";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";

const FornecedoresPage = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      const response = await fornecedorService.listarFornecedores();
      setFornecedores(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };

  const handleNovo = () => {
    setFornecedorSelecionado(null);
    setIsModalOpen(true);
  };

  const handleEditar = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setIsModalOpen(true);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir este fornecedor?")) return;
    try {
      await fornecedorService.deletar(id);
      carregarFornecedores();
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
    }
  };

  const handleSalvar = async (data) => {
    try {
      if (data.id) {
        await fornecedorService.atualizar(data.id, data);
      } else {
        await fornecedorService.criar(data);
      }
      await carregarFornecedores();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      alert("Erro ao salvar fornecedor!");
    }
  };

  const filtrados = useMemo(() => {
    return fornecedores.filter(
      (f) =>
        f.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        f.cnpj?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        f.email?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        f.telefone?.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }, [fornecedores, termoBusca]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const sorted = useMemo(() => {
    const arr = [...filtrados];
    arr.sort((a, b) => {
      const A = a[sortConfig.key] || "";
      const B = b[sortConfig.key] || "";
      if (typeof A === "string" && typeof B === "string") {
        return sortConfig.direction === "asc"
          ? A.localeCompare(B)
          : B.localeCompare(A);
      }
      return sortConfig.direction === "asc" ? A - B : B - A;
    });
    return arr;
  }, [filtrados, sortConfig]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Fornecedores</h1>
        <button
          onClick={handleNovo}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
        >
          Novo
        </button>
      </div>

      {/* Filtro */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome, CNPJ, telefone ou e-mail..."
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
              <Th label="Código" onSort={() => handleSort("id")} active={sortConfig.key === "id"} />
              <Th label="Nome" onSort={() => handleSort("nome")} active={sortConfig.key === "nome"} />
              <Th label="CNPJ" onSort={() => handleSort("cnpj")} active={sortConfig.key === "cnpj"} />
              <Th label="Telefone" onSort={() => handleSort("telefone")} active={sortConfig.key === "telefone"} />
              <Th label="E-mail" onSort={() => handleSort("email")} active={sortConfig.key === "email"} />
              <th className="px-4 py-3 border-b text-center w-40">Ações</th>
            </tr>
          </thead>

          <tbody>
            {sorted.length > 0 ? (
              sorted.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 border-b">{f.id}</td>
                  <td className="px-4 py-2 border-b">{f.nome}</td>
                  <td className="px-4 py-2 border-b">{f.cnpj || "-"}</td>
                  <td className="px-4 py-2 border-b">{f.telefone || "-"}</td>
                  <td className="px-4 py-2 border-b">{f.email || "-"}</td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      onClick={() => handleEditar(f)}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded text-sm"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(f.id)}
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
                  colSpan="6"
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <FornecedorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        fornecedorSelecionado={fornecedorSelecionado}
      />
    </div>
  );
};

const Th = ({ label, onSort, active }) => (
  <th className="px-4 py-3 border-b text-left">
    <button
      type="button"
      onClick={onSort}
      className={`inline-flex items-center gap-1 font-medium ${
        active ? "text-blue-700" : "text-gray-700"
      }`}
    >
      {label}
      <ArrowUpDown size={14} />
    </button>
  </th>
);

export default FornecedoresPage;
