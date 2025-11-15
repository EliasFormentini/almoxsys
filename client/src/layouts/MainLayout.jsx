import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { usuario, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast({
      type: "info",
      title: "Sessão encerrada",
      message: "Você saiu do sistema.",
    });
    navigate("/login");
  };

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <FaBars size={22} />
            </button>

            <h1 className="text-lg font-semibold text-gray-700">
              Sistema de Gestão
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="text-gray-700 font-medium">
                {usuario?.nome || "Usuário"}
              </p>
              {usuario?.email && (
                <p className="text-gray-500 text-xs">{usuario.email}</p>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
            >
              Sair
            </button>
          </div>
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
