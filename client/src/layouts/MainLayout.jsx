import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const [openProdutos, setOpenProdutos] = useState(false);

  return (
    <div className="flex h-screen">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="flex items-center justify-center h-16 text-xl font-bold tracking-wide border-b border-border">
          AlmoxSys
        </div>

        <nav className="flex flex-col mt-4">
          {/* Menu principal - Produtos */}
          <button
            onClick={() => setOpenProdutos(!openProdutos)}
            className={`text-left px-4 py-2 hover:bg-gray-700 rounded transition ${location.pathname.startsWith("/produtos") ? "active" : ""
              }`}
          >
            Produtos
          </button>

          {/* Submenu Produtos */}
          {openProdutos && (
            <div className="ml-6 mt-1 flex flex-col space-y-1">
              <Link
                to="/categorias"
                className={`text-sm px-3 py-1 rounded hover:bg-gray-700 ${location.pathname === "/produtos/categorias" ? "active" : ""
                  }`}
              >
                Categorias
              </Link>
              <Link
                to="/unidades"
                className={`text-sm px-3 py-1 rounded hover:bg-gray-700 ${location.pathname === "/produtos/unidades" ? "active" : ""
                  }`}
              >
                Unidades
              </Link>

            </div>
          )}

          {/* Outros menus */}
          <Link
            to="/requisoes"
            className={`px-4 py-2 hover:bg-gray-700 rounded transition ${location.pathname === "/requisoes" ? "active" : ""
              }`}
          >
            Requisições
          </Link>
        </nav>
      </aside>

      {/* ===== Main content ===== */}
      <div className="flex flex-col flex-1">
        <header className="header">
          <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
          <div className="text-sm text-gray-600">Usuário: Admin</div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
