import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CategoriasPage from "./pages/CategoriasPage";
import UnidadesPage from "./pages/UnidadesPage";
import ProdutosPage from "./pages/ProdutosPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="unidades" element={<UnidadesPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
