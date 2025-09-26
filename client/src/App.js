import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoriaList from "./pages/Categorias/CategoriaList";
import CategoriaForm from "./pages/Categorias/CategoriaForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/categorias" element={<CategoriaList />} />
        <Route path="/categorias/nova" element={<CategoriaForm />} />
        <Route path="/categorias/editar/:id" element={<CategoriaForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
