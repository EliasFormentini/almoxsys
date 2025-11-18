import React, { useEffect, useMemo, useState } from "react";
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
  definirDecks,
} from "../services/usuarioService";
import { listarDecks } from "../services/deckPermissaoService";
import UsuarioModal from "../components/UsuarioModal";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useAlert } from "../hooks/useAlert";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  const { showError, showSuccess, showConfirm } = useAlert();

  const carregar = async () => {
    try {
      setLoading(true);
      const [uRes, dRes] = await Promise.all([
        listarUsuarios(),
        listarDecks(),
      ]);
      setUsuarios(uRes.data || []);
      setDecks(dRes.data || []);
    } catch (err) {
      console.error("Erro ao carregar usuários/decks:", err);
      showError("Erro ao carregar usuários ou decks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleNovo = () => {
    setUsuarioSelecionado(null);
    setIsModalOpen(true);
  };

  const handleEditar = (usuario) => {
    setUsuarioSelecionado(usuario);
    setIsModalOpen(true);
  };

  const handleExcluir = async (id) => {
    const confirm = await showConfirm(
      "Deseja realmente excluir este usuário?"
    );
    if (!confirm) return;

    try {
      await deletarUsuario(id);
      showSuccess("Usuário excluído com sucesso.");
      carregar();
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      showError(
        err.response?.data?.error || "Erro ao excluir usuário."
      );
    }
  };

  const handleSalvar = async (formData) => {
    // validação vinda do próprio modal
    if (formData.__validationError) {
      showError(formData.__validationError);
      return;
    }

    const { id, deckIds = [], senha, ...rest } = formData;

    try {
      let usuarioResp;

      if (id) {
        // UPDATE
        const payload = { ...rest };
        if (senha) payload.senha = senha;
        usuarioResp = await atualizarUsuario(id, payload);
        if (deckIds.length || Array.isArray(deckIds)) {
          await definirDecks(id, deckIds);
        }
        showSuccess("Usuário atualizado com sucesso.");
      } else {
        // CREATE
        const payload = { ...rest, senha };
        usuarioResp = await criarUsuario(payload);

        const novoId = usuarioResp.data?.id;
        if (novoId && (deckIds.length || Array.isArray(deckIds))) {
          await definirDecks(novoId, deckIds);
        }
        showSuccess("Usuário criado com sucesso.");
      }

      setIsModalOpen(false);
      carregar();
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      showError(
        err.response?.data?.error || "Erro ao salvar usuário."
      );
    }
  };

  // filtro
  const filtrados = useMemo(() => {
    const termo = termoBusca.toLowerCase();
    return (usuarios || []).filter((u) => {
      const nome = u.nome?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";
      const perfil = u.perfil?.toLowerCase() || "";
      return (
        nome.includes(termo) ||
        email.includes(termo) ||
        perfil.includes(termo)
      );
    });
  }, [usuarios, termoBusca]);

  // ordenação
  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const sorted = useMemo(() => {
    const arr = [...filtrados];

    const getValue = (u, key) => {
      switch (key) {
        case "id":
          return Number(u.id) || 0;
        case "nome":
          return u.nome || "";
        case "email":
          return u.email || "";
        case "perfil":
          return u.perfil || "";
        default:
          return "";
      }
    };

    arr.sort((a, b) => {
      const A = getValue(a, sortConfig.key);
      const B = getValue(b, sortConfig.key);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          Usuários
        </h1>
        <button
          onClick={handleNovo}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-medium shadow-sm"
        >
          Novo
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome, e-mail ou perfil..."
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
                label="E-mail"
                onSort={() => handleSort("email")}
                active={sortConfig.key === "email"}
              />
              <Th
                label="Perfil"
                onSort={() => handleSort("perfil")}
                active={sortConfig.key === "perfil"}
              />
              <th className="px-4 py-3 border-b text-left">Decks</th>
              <th className="px-4 py-3 border-b text-center w-40">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-4 text-center text-gray-500"
                >
                  Carregando...
                </td>
              </tr>
            ) : sorted.length > 0 ? (
              sorted.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 border-b">{u.id}</td>
                  <td className="px-4 py-2 border-b">{u.nome}</td>
                  <td className="px-4 py-2 border-b">{u.email}</td>
                  <td className="px-4 py-2 border-b">
                    {u.perfil === "admin" ? (
                      <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                        Usuário
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {u.decks?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {u.decks.map((d) => (
                          <span
                            key={d.id}
                            className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-100"
                          >
                            {d.nome}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Nenhum
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      onClick={() => handleEditar(u)}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded text-sm"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluir(u.id)}
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
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        usuarioSelecionado={usuarioSelecionado}
        decksDisponiveis={decks}
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
      title="Ordenar"
    >
      {label}
      <ArrowUpDown size={14} />
    </button>
  </th>
);

export default UsuariosPage;
