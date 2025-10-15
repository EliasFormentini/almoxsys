// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <aside
//       style={{
//         width: "200px",
//         height: "100vh",
//         background: "#222",
//         color: "#fff",
//         padding: "20px",
//       }}
//     >
//       <h2>AlmoxSys</h2>
//       <nav>
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           <li>
//             <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/categorias" style={{ color: "#fff", textDecoration: "none" }}>
//               Categorias
//             </Link>
//           </li>
//           <li>
//             <Link to="/produtos" style={{ color: "#fff", textDecoration: "none" }}>
//               Produtos
//             </Link>
//           </li>
//           <li>
//             <Link to="/unidades" style={{ color: "#fff", textDecoration: "none" }}>
//               Unidades
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


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
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const linkBaseClass =
    "flex items-center p-2 rounded hover:bg-gray-800 transition-colors";
  const activeClass = "bg-gray-800 text-white font-semibold";

  return (
    <aside
      className={`${
        isOpen ? "w-60" : "w-0"
      } bg-gray-900 text-gray-300 transition-all duration-300 overflow-hidden h-screen fixed`}
    >
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Painel
      </div>

      <nav className="p-4 space-y-2">
        {/* Produtos com submenu */}
        <div>
          <button
            onClick={() => setOpenSubmenu(!openSubmenu)}
            className="flex items-center w-full text-left hover:bg-gray-800 p-2 rounded"
          >
            <FaBox className="mr-2" />
            Produtos
            {openSubmenu ? (
              <FaChevronUp className="ml-auto text-sm" />
            ) : (
              <FaChevronDown className="ml-auto text-sm" />
            )}
          </button>

          {openSubmenu && (
            <div className="ml-6 mt-1 space-y-1">
              <NavLink
                to="/categorias"
                className={({ isActive }) =>
                  `${linkBaseClass} text-sm ${
                    isActive ? activeClass : "text-gray-400"
                  }`
                }
              >
                <FaTags className="mr-2" /> Categorias
              </NavLink>
              <NavLink
                to="/unidades"
                className={({ isActive }) =>
                  `${linkBaseClass} text-sm ${
                    isActive ? activeClass : "text-gray-400"
                  }`
                }
              >
                <FaRuler className="mr-2" /> Unidades de Medida
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/fornecedores"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaTruck className="mr-2" /> Fornecedores
        </NavLink>

        <NavLink
          to="/movimentacoes"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaExchangeAlt className="mr-2" /> Movimentações
        </NavLink>

        <NavLink
          to="/usuarios"
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaUsers className="mr-2" /> Usuários
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
