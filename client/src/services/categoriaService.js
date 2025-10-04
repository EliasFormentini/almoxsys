import axios from "axios";

import api from "./api";

export const listarCategorias = async () => {
  const response = await api.get("/categorias");
  return response.data;
};

export const criarCategoria = async (dados) => {
  const response = await api.post("/categorias", dados);
  return response.data;
};

export const atualizarCategoria = async (id, dados) => {
  const response = await api.put(`/categorias/${id}`, dados);
  return response.data;
};

export const deletarCategoria = async (id) => {
  const response = await api.delete(`/categorias/${id}`);
  return response.data;
};
