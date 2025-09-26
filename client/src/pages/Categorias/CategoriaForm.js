import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categoriaService from "../../services/categoriaService";

function CategoriaForm() {
  const [nome, setNome] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      categoriaService.buscarPorId(id).then((res) => {
        setNome(res.data.nome);
      });
    }
  }, [id]);

  const salvar = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await categoriaService.atualizar(id, { nome });
      } else {
        await categoriaService.criar({ nome });
      }
      navigate("/categorias");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div>
      <h2>{id ? "Editar Categoria" : "Nova Categoria"}</h2>
      <form onSubmit={salvar}>
        <label>Nome: </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CategoriaForm;
