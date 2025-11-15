import React, { useEffect, useMemo, useState } from "react";
import * as fornecedorService from "../services/fornecedorService";
import FornecedorModal from "../components/FornecedorModal";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useAlert } from "../hooks/useAlert";
import { useToast } from "../contexts/ToastContext";

const FornecedoresPage = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const { alert, confirm, AlertComponent } = useAlert();
  const { showToast } = useToast();

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      const response = await fornecedorService.listarFornecedores();
      setFornecedores(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      showToast({
        type: "error",
        title: "Erro ao carregar",
        message: "Não foi possível carregar os fornecedores.",
      });
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
    const ok = await confirm({
      title: "Excluir fornecedor",
      message: "Deseja realmente excluir este fornecedor?",
      type: "warning",
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
    });

    if (!ok) return;

    try {
      await fornecedorService.deletar(id);
      await carregarFornecedores();

      showToast({
        type: "success",
        title: "Fornecedor excluído",
        message: "O fornecedor foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      await alert({
        title: "Erro ao excluir",
        message:
          error.response?.data?.error ||
          "Não foi possível excluir o fornecedor. Verifique se ele não está em uso.",
        type: "error",
      });
    }
  };

  const handleSalvar = async (data) => {
    try {
      if (data.id) {
        await fornecedorService.atualizar(data.id, data);
        showToast({
          type: "success",
          title: "Fornecedor atualizado",
          message: "Os dados do fornecedor foram salvos com sucesso.",
        });
      } else {
        await fornecedorService.criar(data);
        showToast({
          type: "success",
          title: "Fornecedor criado",
          message: "Novo fornecedor cadastrado com sucesso.",
        });
      }

      await carregarFornecedores();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      await alert({
        title: "Erro ao salvar fornecedor",
        message:
          error.response?.data?.error ||
          "Não foi possível salvar o fornecedor. Tente novamente.",
        type: "error",
      });
    }
  };

  const filtrados = useMemo(() => {
    const termo = termoBusca.toLowerCase();
    return (fornecedores || []).filter(
      (f) =>
        f.nome?.toLowerCase().includes(termo) ||
        f.cnpj?.toLowerCase().includes(termo) ||
        f.email?.toLowerCase().includes(termo) ||
        f.telefone?.toLowerCase().includes(termo)
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
        const comp = A.localeCompare(B, "pt-BR", { sensitivity: "base" });
        return sortConfig.direction === "asc" ? comp : -comp;
      }

      const numA = Number(A) || 0;
      const numB = Number(B) || 0;
      const comp = numA - numB;
      return sortConfig.direction === "asc" ? comp : -comp;
    });

    return arr;
  }, [filtrados, sortConfig]);

  return (
    <>
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
                <Th
                  label="Código"
                  onSort={() => handleSort("id")}
                  active={sortConfig.key === "id"}
                />
                <Th
                  label="Nome"
                  onSort={() => handleSort("nome")}
                  active={sortConfig.key === "nome"}
                />
                <Th
                  label="CNPJ"
                  onSort={() => handleSort("cnpj")}
                  active={sortConfig.key === "cnpj"}
                />
                <Th
                  label="Telefone"
                  onSort={() => handleSort("telefone")}
                  active={sortConfig.key === "telefone"}
                />
                <Th
                  label="E-mail"
                  onSort={() => handleSort("email")}
                  active={sortConfig.key === "email"}
                />
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

      {AlertComponent}
    </>
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
