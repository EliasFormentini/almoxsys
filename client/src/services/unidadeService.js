import api from "./api";

// Listar todas as unidades
export const listarUnidades = async () => {
  const response = await api.get("/unidades");
  return response.data;
};

// Buscar uma unidade por ID
export const buscarUnidade = async (id) => {
  const response = await api.get(`/unidades/${id}`);
  return response.data;
};

// Criar uma nova unidade
export const salvarUnidade = async (unidade) => {
  const response = await api.post("/unidades", unidade);
  return response.data;
};

// Atualizar unidade existente
export const atualizarUnidade = async (id, unidade) => {
  const response = await api.put(`/unidades/${id}`, unidade);
  return response.data;
};

// Deletar unidade
export const deletarUnidade = async (id) => {
  const response = await api.delete(`/unidades/${id}`);
  return response.data;
};
