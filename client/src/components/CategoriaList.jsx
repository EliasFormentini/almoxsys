const CategoriaList = ({ categorias, onEdit, onDelete }) => {
  if (!categorias.length) {
    return <p>Nenhuma categoria cadastrada.</p>;
  }

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
        {categorias.map((cat) => (
          <tr key={cat.id}>
            <td>{cat.id}</td>
            <td>{cat.nome}</td>
            <td>
              <button onClick={() => onEdit(cat)} style={{ marginRight: "8px" }}>
                Editar
              </button>
              <button onClick={() => onDelete(cat.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriaList;
