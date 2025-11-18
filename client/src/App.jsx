import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import CategoriasPage from "./pages/CategoriasPage";
import UnidadesPage from "./pages/UnidadesPage";
import ProdutosPage from "./pages/ProdutosPage";
import FornecedoresPage from "./pages/FornecedoresPage";
import EntradasPage from "./pages/EntradasPage";
import SaidasPage from "./pages/SaidasPage";
import InventarioPage from "./pages/InventarioPage";
import InventarioDetalhePage from "./pages/InventarioDetalhePage";
import UsuariosPage from "./pages/UsuariosPage";

import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas protegidas (dentro do layout principal) */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              {/* Página inicial dentro do layout */}
              <Route index element={<EntradasPage />} />

              <Route path="categorias" element={<CategoriasPage />} />
              <Route path="unidades" element={<UnidadesPage />} />
              <Route path="produtos" element={<ProdutosPage />} />
              <Route path="fornecedores" element={<FornecedoresPage />} />
              <Route path="entradas" element={<EntradasPage />} />
              <Route path="saidas" element={<SaidasPage />} />
              <Route path="inventario" element={<InventarioPage />} />
              <Route path="inventario/:id" element={<InventarioDetalhePage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
