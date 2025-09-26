import api from "./api";

const unidadeService = {
  listar: () => api.get("/unidades"),
  buscarPorId: (id) => api.get(`/unidades/${id}`),
  criar: (dados) => api.post("/unidades", dados),
  atualizar: (id, dados) => api.put(`/unidades/${id}`, dados),
  excluir: (id) => api.delete(`/unidades/${id}`),
};

export default unidadeService;
