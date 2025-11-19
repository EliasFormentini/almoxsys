import React, { useEffect, useMemo, useState } from "react";
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
  definirDecks,
} from "../services/usuarioService";
import UsuarioModal from "../components/UsuarioModal";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { FaShieldAlt } from "react-icons/fa";
import { useAlert } from "../hooks/useAlert";

// ---- Decks fixos em código ----
const DECKS_FIXOS = [
  { code: "PRODUTOS", label: "Produtos (Categorias / Unidades / Produtos)" },
  { code: "FORNECEDORES", label: "Fornecedores" },
  { code: "MOVIMENTACOES", label: "Movimentações (Entradas / Saídas / Inventário)" },
  { code: "RELATORIOS", label: "Relatórios" },
];

// helper para garantir que sempre temos um array
const getPermissoesArray = (permissoes) => {
  if (!permissoes) return [];

  if (Array.isArray(permissoes)) return permissoes;

  if (typeof permissoes === "string") {
    // tenta JSON
    try {
      const parsed = JSON.parse(permissoes);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // tenta lista separada por vírgula
      return permissoes
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [usuarioPermissoes, setUsuarioPermissoes] = useState(null);

  const [termoBusca, setTermoBusca] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  const { alert, confirm, AlertComponent } = useAlert();

  // ---- CARREGAR USUÁRIOS (sem useCallback, sem deps de alert) ----
  const carregar = async () => {
    try {
      setLoading(true);
      const res = await listarUsuarios();
      setUsuarios(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      await alert({
        type: "error",
        title: "Erro",
        message: "Erro ao carregar usuários.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const confirmado = await confirm({
      type: "warning",
      title: "Confirmar exclusão",
      message: "Deseja realmente excluir este usuário?",
    });
    if (!confirmado) return;

    try {
      await deletarUsuario(id);
      await alert({
        type: "success",
        title: "Sucesso",
        message: "Usuário excluído com sucesso.",
      });
      carregar();
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      await alert({
        type: "error",
        title: "Erro",
        message: err.response?.data?.error || "Erro ao excluir usuário.",
      });
    }
  };

  const handleSalvar = async (formData) => {
    if (formData.__validationError) {
      await alert({
        type: "error",
        title: "Validação",
        message: formData.__validationError,
      });
      return;
    }

    const { id, senha, ...rest } = formData;

    try {
      if (id) {
        const payload = { ...rest };
        if (senha) payload.senha = senha;
        await atualizarUsuario(id, payload);
        await alert({
          type: "success",
          title: "Sucesso",
          message: "Usuário atualizado com sucesso.",
        });
      } else {
        const payload = { ...rest, senha };
        await criarUsuario(payload);
        await alert({
          type: "success",
          title: "Sucesso",
          message: "Usuário criado com sucesso.",
        });
      }

      setIsModalOpen(false);
      setUsuarioSelecionado(null);
      carregar();
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      await alert({
        type: "error",
        title: "Erro",
        message: err.response?.data?.error || "Erro ao salvar usuário.",
      });
    }
  };

  const handleAbrirPermissoes = (usuario) => {
    setUsuarioPermissoes(usuario);
    setIsPermModalOpen(true);
  };

  const handleSalvarPermissoes = async (usuarioId, permissoesSelecionadas) => {
    try {
      await definirDecks(usuarioId, permissoesSelecionadas);
      await alert({
        type: "success",
        title: "Sucesso",
        message: "Permissões atualizadas com sucesso.",
      });

      setIsPermModalOpen(false);
      setUsuarioPermissoes(null);
      await carregar();
    } catch (err) {
      console.error("Erro ao salvar permissões:", err);
      await alert({
        type: "error",
        title: "Erro",
        message:
          err.response?.data?.error ||
          "Erro ao salvar permissões do usuário.",
      });
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
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-2xl font-semibold text-gray-800">Usuários</h1>
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
                <th className="px-4 py-3 border-b text-left">Permissões</th>
                <th className="px-4 py-3 border-b text-center w-48">
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
                sorted.map((u) => {
                  const permsArr = getPermissoesArray(u.permissoes);

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 border-b">{u.id}</td>
                      <td className="px-4 py-2 border-b">{u.nome}</td>
                      <td className="px-4 py-2 border-b">{u.email}</td>
                      <td className="px-4 py-2 border-b">
                        {u.perfil === "admin" || u.perfil === "administrador" ? (
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
                        {permsArr.length ? (
                          <div className="flex flex-wrap gap-1">
                            {permsArr.map((code) => {
                              const deck = DECKS_FIXOS.find(
                                (d) => d.code === code
                              );
                              return (
                                <span
                                  key={code}
                                  className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-100"
                                >
                                  {deck?.label || code}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Nenhum
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b text-center space-x-2">
                        <button
                          onClick={() => handleAbrirPermissoes(u)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-sm"
                          title="Permissões"
                        >
                          <FaShieldAlt size={14} />
                        </button>
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
                  );
                })
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

        {/* Modal de cadastro/edição de usuário */}
        <UsuarioModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setUsuarioSelecionado(null);
          }}
          onSave={handleSalvar}
          usuarioSelecionado={usuarioSelecionado}
        />

        {/* Modal de permissões */}
        <PermissoesModal
          isOpen={isPermModalOpen}
          usuario={usuarioPermissoes}
          decks={DECKS_FIXOS}
          onClose={() => {
            setIsPermModalOpen(false);
            setUsuarioPermissoes(null);
          }}
          onSave={handleSalvarPermissoes}
        />
      </div>

      {/* componente do hook de alert */}
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
      title="Ordenar"
    >
      {label}
      <ArrowUpDown size={14} />
    </button>
  </th>
);

// ---- Modal de Permissões ----
const PermissoesModal = ({ isOpen, usuario, decks, onClose, onSave }) => {
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    if (isOpen && usuario) {
      const perms = getPermissoesArray(usuario.permissoes);
      setSelecionadas(perms);
    } else if (!isOpen) {
      setSelecionadas([]);
    }
  }, [isOpen, usuario]);

  if (!isOpen || !usuario) return null;

  const togglePermissao = (code) => {
    setSelecionadas((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleConfirmar = () => {
    onSave(usuario.id, selecionadas);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Permissões de {usuario.nome}
          </h2>
          <button
            onClick={onClose}
            className="text-xl leading-none hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-700 mb-2">
            Selecione os decks de permissão que este usuário poderá acessar:
          </p>

          <div className="space-y-2">
            {decks.map((deck) => (
              <label
                key={deck.code}
                className="flex items-start gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selecionadas.includes(deck.code)}
                  onChange={() => togglePermissao(deck.code)}
                />
                <span className="text-sm text-gray-800">{deck.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Salvar Permissões
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;
