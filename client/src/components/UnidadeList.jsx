const UnidadeList = ({ unidades, onEdit, onDelete }) => {
  if (!unidades.length) {
    return <p>Nenhuma unidade cadastrada.</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Sigla</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {unidades.map((uni) => (
          <tr key={uni.id}>
            <td>{uni.id}</td>
            <td>{uni.descricao}</td>
            <td>{uni.sigla}</td>
            <td>
              <button onClick={() => onEdit(uni)} style={{ marginRight: "8px" }}>
                Editar
              </button>
              <button onClick={() => onDelete(uni.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UnidadeList;
