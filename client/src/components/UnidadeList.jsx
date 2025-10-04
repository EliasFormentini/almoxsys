import { deletarUnidade } from "../services/unidadeService";

const UnidadeList = ({ unidades, onEdit, onAtualizar }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta unidade?")) {
      try {
        await deletarUnidade(id);
        onAtualizar();
      } catch (err) {
        console.error("Erro ao excluir unidade:", err);
        alert("Erro ao excluir unidade");
      }
    }
  };

  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Sigla</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {unidades.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.sigla}</td>
            <td>{u.descricao}</td>
            <td>
              <button onClick={() => onEdit(u)}>Editar</button>
              <button onClick={() => handleDelete(u.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UnidadeList;
