import { useEffect, useState } from "react";
import categoriaService from "../../services/categoriaService";

function CategoriaList() {
  const [categorias, setCategorias] = useState([]);

  const carregarCategorias = async () => {
    try {
      const res = await categoriaService.listar();
      setCategorias(res.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const excluirCategoria = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await categoriaService.excluir(id);
        carregarCategorias();
      } catch (error) {
        console.error("Erro ao excluir:", error);
      }
    }
  };

  return (
    <div>
      <h2>📂 Categorias</h2>
      <a href="/categorias/nova">+ Nova Categoria</a>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nome}</td>
              <td>
                <a href={`/categorias/editar/${cat.id}`}>Editar</a> |{" "}
                <button onClick={() => excluirCategoria(cat.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriaList;
