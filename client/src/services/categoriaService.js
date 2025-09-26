import api from "./api";

const categoriaService = {
  listar: () => api.get("/categorias"),
  buscarPorId: (id) => api.get(`/categorias/${id}`),
  criar: (dados) => api.post("/categorias", dados),
  atualizar: (id, dados) => api.put(`/categorias/${id}`, dados),
  excluir: (id) => api.delete(`/categorias/${id}`),
};

export default categoriaService;
