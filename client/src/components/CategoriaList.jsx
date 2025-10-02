import { deletarCategoria } from "../services/categoriaService";

const CategoriaList = ({ categorias, onEditar, onAtualizar }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Deseja excluir esta categoria?")) {
      try {
        await deletarCategoria(id);
        alert("Categoria excluída com sucesso!");
        if (onAtualizar) onAtualizar();
      } catch (err) {
        console.error("Erro ao excluir categoria:", err);
        alert("Erro ao excluir categoria");
      }
    }
  };

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {categorias.length > 0 ? (
          categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>
                <button onClick={() => onEditar(c)} style={{ marginRight: "5px" }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(c.id)}>Excluir</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" style={{ textAlign: "center" }}>
              Nenhuma categoria encontrada
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CategoriaList;
