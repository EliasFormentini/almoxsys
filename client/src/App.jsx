import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CategoriasPage from "./pages/CategoriasPage";
import ProdutosPage from "./pages/ProdutosPage";
import UnidadesPage from "./pages/UnidadesPage";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<h1>Dashboard</h1>} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/unidades" element={<UnidadesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
