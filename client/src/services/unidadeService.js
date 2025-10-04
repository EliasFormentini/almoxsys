import api from "./api";

export const listarUnidades = async () => {
  const res = await api.get("/unidades");
  return res.data;
};

export const criarUnidade = async (unidade) => {
  const res = await api.post("/unidades", unidade);
  return res.data;
};

export const atualizarUnidade = async (id, unidade) => {
  const res = await api.put(`/unidades/${id}`, unidade);
  return res.data;
};

export const deletarUnidade = async (id) => {
  await api.delete(`/unidades/${id}`);
};
