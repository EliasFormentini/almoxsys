import React, { useEffect, useMemo, useState } from "react";
import * as produtoService from "../services/produtoService";
import { listar as listarCategorias } from "../services/categoriaService";
import ProdutoModal from "../components/ProdutoModal";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useAlert } from "../hooks/useAlert";
import { useToast } from "../contexts/ToastContext";

const ProdutosPage = () => {
  // --------- ESTADO BASE ---------
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // --------- FILTROS ----------
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [comSaldo, setComSaldo] = useState(false);
  const [abaixoMinimo, setAbaixoMinimo] = useState(false);
  const [exibirInativos, setExibirInativos] = useState(false);

  // --------- ORDENAÇÃO ----------
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const { alert, confirm, AlertComponent } = useAlert();
  const { showToast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [prodResp, catResp] = await Promise.all([
        produtoService.listar(),
        listarCategorias(),
      ]);
      setProdutos(prodResp.data || []);
      setCategorias(catResp.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      await alert({
        title: "Erro ao carregar",
        message: "Não foi possível carregar os produtos/categorias.",
        type: "error",
      });
    }
  };

  // ---------- AÇÕES -----------
  const handleNovo = () => {
    setProdutoSelecionado(null);
    setIsModalOpen(true);
  };

  const handleEditar = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const handleExcluir = async (id) => {
    const ok = await confirm({
      title: "Excluir produto",
      message: "Deseja realmente excluir este produto?",
      type: "warning",
    });
    if (!ok) return;

    try {
      await produtoService.deletar(id);
      await carregarDados();

      showToast({
        type: "success",
        title: "Produto excluído",
        message: `O produto #${id} foi removido com sucesso.`,
      });
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      showToast({
        type: "error",
        title: "Erro ao excluir",
        message: "Não foi possível excluir o produto.",
      });
    }
  };

  const handleSalvar = async (data) => {
    try {
      if (data.id) {
        await produtoService.atualizar(data.id, data);
        showToast({
          type: "success",
          title: "Produto atualizado",
          message: `Produto "${data.nome}" atualizado com sucesso.`,
        });
      } else {
        await produtoService.criar(data);
        showToast({
          type: "success",
          title: "Produto criado",
          message: `Produto "${data.nome}" criado com sucesso.`,
        });
      }

      await carregarDados();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      await alert({
        title: "Erro ao salvar produto",
        message: "Não foi possível salvar o produto. Verifique os dados e tente novamente.",
        type: "error",
      });
    }
  };

  // ---------- FILTRAGEM ----------
  const filtrados = useMemo(() => {
    return (produtos || [])
      .filter((p) =>
        termoBusca
          ? p.nome?.toLowerCase().includes(termoBusca.toLowerCase())
          : true
      )
      .filter((p) =>
        categoriaFiltro ? p.id_categoria === Number(categoriaFiltro) : true
      )
      .filter((p) => (comSaldo ? Number(p.estoque_atual) > 0 : true))
      .filter((p) =>
        abaixoMinimo
          ? Number(p.estoque_atual) < Number(p.estoque_minimo)
          : true
      )
      .filter((p) => (exibirInativos ? true : p.status === "A"));
  }, [produtos, termoBusca, categoriaFiltro, comSaldo, abaixoMinimo, exibirInativos]);

  // ---------- ORDENAÇÃO ----------
  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const sorted = useMemo(() => {
    const arr = [...filtrados];

    const getComparable = (p, key) => {
      switch (key) {
        case "id":
          return Number(p.id) || 0;
        case "nome":
          return p.nome || "";
        case "categoria":
          return p.categoria?.nome || "";
        case "unidade":
          return p.unidade?.sigla || "";
        case "estoque_atual":
          return Number(p.estoque_atual) || 0;
        case "estoque_minimo":
          return Number(p.estoque_minimo) || 0;
        case "custo_medio":
          return Number(p.custo_medio) || 0;
        default:
          return "";
      }
    };

    arr.sort((a, b) => {
      const A = getComparable(a, sortConfig.key);
      const B = getComparable(b, sortConfig.key);

      if (typeof A === "string" || typeof B === "string") {
        const comp = String(A).localeCompare(String(B), "pt-BR", {
          sensitivity: "base",
          numeric: true,
        });
        return sortConfig.direction === "asc" ? comp : -comp;
      } else {
        const comp = A - B;
        return sortConfig.direction === "asc" ? comp : -comp;
      }
    });

    return arr;
  }, [filtrados, sortConfig]);

  // ---------- RENDER ----------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Produtos</h1>
        <button
          onClick={handleNovo}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
        >
          Novo
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center mb-4 bg-white p-4 rounded-md shadow-sm">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={comSaldo}
            onChange={(e) => setComSaldo(e.target.checked)}
          />
          Com saldo
        </label>

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={abaixoMinimo}
            onChange={(e) => setAbaixoMinimo(e.target.checked)}
          />
          Abaixo do estoque mínimo
        </label>

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={exibirInativos}
            onChange={(e) => setExibirInativos(e.target.checked)}
          />
          Exibir inativos
        </label>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <Th label="Código" onSort={() => handleSort("id")} active={sortConfig.key === "id"} />
              <Th label="Nome" onSort={() => handleSort("nome")} active={sortConfig.key === "nome"} />
              <Th label="Categoria" onSort={() => handleSort("categoria")} active={sortConfig.key === "categoria"} />
              <Th label="Unidade" onSort={() => handleSort("unidade")} active={sortConfig.key === "unidade"} />
              <Th label="Estoque Atual" onSort={() => handleSort("estoque_atual")} active={sortConfig.key === "estoque_atual"} />
              <Th label="Estoque Mínimo" onSort={() => handleSort("estoque_minimo")} active={sortConfig.key === "estoque_minimo"} />
              <Th label="Custo Médio" onSort={() => handleSort("custo_medio")} active={sortConfig.key === "custo_medio"} />
              <th className="px-4 py-3 border-b text-center w-40">Ações</th>
            </tr>
          </thead>

          <tbody>
            {sorted.length > 0 ? (
              sorted.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    p.status === "I" ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-4 py-2 border-b">{p.id}</td>
                  <td className="px-4 py-2 border-b">{p.nome}</td>
                  <td className="px-4 py-2 border-b">{p.categoria?.nome || "-"}</td>
                  <td className="px-4 py-2 border-b">{p.unidade?.sigla || "-"}</td>
                  <td
                    className={`px-4 py-2 border-b ${
                      Number(p.estoque_atual) < Number(p.estoque_minimo)
                        ? "text-red-600 font-semibold"
                        : "text-blue-700 font-medium"
                    }`}
                  >
                    {Number(p.estoque_atual) || 0}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {Number(p.estoque_minimo) || 0}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {p.custo_medio != null ? Number(p.custo_medio).toFixed(2) : "-"}
                  </td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      onClick={() => handleEditar(p)}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded text-sm"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(p.id)}
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
                  colSpan="8"
                  className="px-4 py-4 text-center text-gray-500 italic"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ProdutoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        produtoSelecionado={produtoSelecionado}
      />

      {AlertComponent}
    </div>
  );
};

// Cabeçalho com botão de ordenação
const Th = ({ label, onSort, active }) => (
  <th className="px-4 py-3 border-b text-left">
    <button
      type="button"
      onClick={onSort}
      className={`inline-flex items-center gap-1 font-medium ${
        active ? "text-blue-700" : "text-gray-700"
      }`}
      title="Ordenar"
    >
      {label}
      <ArrowUpDown size={14} />
    </button>
  </th>
);

export default ProdutosPage;
