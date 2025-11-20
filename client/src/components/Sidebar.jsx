import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBox,
  FaTags,
  FaRuler,
  FaTruck,
  FaExchangeAlt,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaArrowDown,
  FaArrowUp,
  FaClipboardList,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ isOpen }) => {
  const [openProdutos, setOpenProdutos] = useState(false);
  const [openMovimentacoes, setOpenMovimentacoes] = useState(false);

  const { usuario } = useAuth();

  // ---- helper pra garantir array de permissões ----
  const getPermissoesArray = () => {
    if (!usuario) return [];

    const raw = usuario.permissoes;
    if (!raw) return [];

    if (Array.isArray(raw)) return raw;

    if (typeof raw === "string") {
      // tenta JSON primeiro
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // não era JSON, tenta lista separada por vírgula
        return raw
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  const isAdmin =
    usuario?.perfil === "admin" || usuario?.perfil === "administrador";

  const permissoes = getPermissoesArray();

  const canProdutos = isAdmin || permissoes.includes("PRODUTOS");
  const canFornecedores = isAdmin || permissoes.includes("FORNECEDORES");
  const canMovimentacoes = isAdmin || permissoes.includes("MOVIMENTACOES");
  const canPedidos = isAdmin || permissoes.includes("PEDIDOS");
  const canUsuarios = isAdmin; // só admin vê Usuários

  const linkBaseClass =
    "flex items-center p-2 rounded hover:bg-gray-800 transition-colors";
  const activeClass = "bg-gray-800 text-white font-semibold";

  return (
    <aside
      className={`${isOpen ? "w-60" : "w-0"
        } bg-gray-900 text-gray-300 transition-all duration-300 overflow-hidden h-screen fixed`}
    >
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Painel
      </div>

      <nav className="p-4 space-y-2">
        {/* Produtos com submenu (proteção por deck PRODUTOS ou admin) */}
        {canProdutos && (
          <div>
            <button
              onClick={() => setOpenProdutos(!openProdutos)}
              className="flex items-center w-full text-left hover:bg-gray-800 p-2 rounded"
            >
              <FaBox className="mr-2" />
              Produtos
              {openProdutos ? (
                <FaChevronUp className="ml-auto text-sm" />
              ) : (
                <FaChevronDown className="ml-auto text-sm" />
              )}
            </button>

            {openProdutos && (
              <div className="ml-6 mt-1 space-y-1">
                <NavLink
                  to="/categorias"
                  className={({ isActive }) =>
                    `${linkBaseClass} text-sm ${isActive ? activeClass : "text-gray-400"
                    }`
                  }
                >
                  <FaTags className="mr-2" /> Categorias
                </NavLink>

                <NavLink
                  to="/unidades"
                  className={({ isActive }) =>
                    `${linkBaseClass} text-sm ${isActive ? activeClass : "text-gray-400"
                    }`
                  }
                >
                  <FaRuler className="mr-2" /> Unidades de Medida
                </NavLink>

                <NavLink
                  to="/produtos"
                  className={({ isActive }) =>
                    `${linkBaseClass} text-sm ${isActive ? activeClass : "text-gray-400"
                    }`
                  }
                >
                  <FaBoxOpen className="mr-2" /> Produtos
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* Fornecedores (deck FORNECEDORES ou admin) */}
        {canFornecedores && (
          <NavLink
            to="/fornecedores"
            className={({ isActive }) =>
              `${linkBaseClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaTruck className="mr-2" /> Fornecedores
          </NavLink>
        )}

        {/* Movimentações com submenu (deck MOVIMENTACOES ou admin) */}
        {canMovimentacoes && (
          <div>
            <button
              onClick={() => setOpenMovimentacoes(!openMovimentacoes)}
              className="flex items-center w-full text-left hover:bg-gray-800 p-2 rounded"
            >
              <FaExchangeAlt className="mr-2" />
              Movimentações
              {openMovimentacoes ? (
                <FaChevronUp className="ml-auto text-sm" />
              ) : (
                <FaChevronDown className="ml-auto text-sm" />
              )}
            </button>

            {openMovimentacoes && (
              <div className="ml-6 mt-1 space-y-1">
                <NavLink
                  to="/entradas"
                  className={({ isActive }) =>
                    `${linkBaseClass} text-sm ${isActive ? activeClass : "text-gray-400"
                    }`
                  }
                >
                  <FaArrowDown className="mr-2" /> Entradas
                </NavLink>

                <NavLink
                  to="/saidas"
                  className={({ isActive }) =>
                    `${linkBaseClass} text-sm ${isActive ? activeClass : "text-gray-400"
                    }`
                  }
                >
                  <FaArrowUp className="mr-2" /> Saídas
                </NavLink>

                <NavLink
                  to="/inventario"
                  className={({ isActive }) =>
                    `${linkBaseClass} text-sm ${isActive ? activeClass : "text-gray-400"
                    }`
                  }
                >
                  <FaClipboardList className="mr-2" /> Inventário
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* Relatórios (futuro) */}
        {canPedidos && (
          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              `${linkBaseClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaHandHoldingUsd  className="mr-2" /> Pedidos
          </NavLink>
        )}

        {/* Usuários (somente admin) */}
        {canUsuarios && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `${linkBaseClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaUsers className="mr-2" /> Usuários
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
