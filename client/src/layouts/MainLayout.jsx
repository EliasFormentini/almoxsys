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
