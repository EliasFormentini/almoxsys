import api from "./api";

const produtoService = {
  listar: () => api.get("/produtos"),
  buscarPorId: (id) => api.get(`/produtos/${id}`),
  criar: (dados) => api.post("/produtos", dados),
  atualizar: (id, dados) => api.put(`/produtos/${id}`, dados),
  excluir: (id) => api.delete(`/produtos/${id}`),
};

export default produtoService;
