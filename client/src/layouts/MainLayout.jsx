// import { useState } from "react";
// import { Outlet, Link, useLocation } from "react-router-dom";

// export default function MainLayout() {
//   const location = useLocation();
//   const [openProdutos, setOpenProdutos] = useState(false);

//   return (
//     <div className="flex h-screen">
//       {/* ===== Sidebar ===== */}
//       <aside className="sidebar">
//         <div className="flex items-center justify-center h-16 text-xl font-bold tracking-wide border-b border-border">
//           AlmoxSys
//         </div>

//         <nav className="flex flex-col mt-4">
//           {/* Menu principal - Produtos */}
//           <button
//             onClick={() => setOpenProdutos(!openProdutos)}
//             className={`text-left px-4 py-2 hover:bg-gray-700 rounded transition ${location.pathname.startsWith("/produtos") ? "active" : ""
//               }`}
//           >
//             Produtos
//           </button>

//           {/* Submenu Produtos */}
//           {openProdutos && (
//             <div className="ml-6 mt-1 flex flex-col space-y-1">
//               <Link
//                 to="/categorias"
//                 className={`text-sm px-3 py-1 rounded hover:bg-gray-700 ${location.pathname === "/produtos/categorias" ? "active" : ""
//                   }`}
//               >
//                 Categorias
//               </Link>
//               <Link
//                 to="/unidades"
//                 className={`text-sm px-3 py-1 rounded hover:bg-gray-700 ${location.pathname === "/produtos/unidades" ? "active" : ""
//                   }`}
//               >
//                 Unidades
//               </Link>

//             </div>
//           )}

//           {/* Outros menus */}
//           <Link
//             to="/requisoes"
//             className={`px-4 py-2 hover:bg-gray-700 rounded transition ${location.pathname === "/requisoes" ? "active" : ""
//               }`}
//           >
//             Requisições
//           </Link>
//         </nav>
//       </aside>

//       {/* ===== Main content ===== */}
//       <div className="flex flex-col flex-1">
//         <header className="header">
//           <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
//           <div className="text-sm text-gray-600">Usuário: Admin</div>
//         </header>

//         <main className="main-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Conteúdo principal */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-0"
        }`}
      >
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <FaBars size={22} />
          </button>

          <h1 className="text-lg font-semibold text-gray-700">
            Sistema de Gestão
          </h1>

          <span className="text-gray-600 text-sm">Usuário: Admin</span>
        </header>

        {/* Conteúdo dinâmico das páginas */}
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
