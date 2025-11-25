import axios from "axios";

const API_URL = "http://localhost:3000/api/produtos";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const listarProdutos = () =>
  axios.get(API_URL, {
    headers: getAuthHeader(),
  });

export const criar = (produto) =>
  axios.post(API_URL, produto, {
    headers: getAuthHeader(),
  });

export const atualizar = (id, produto) =>
  axios.put(`${API_URL}/${id}`, produto, {
    headers: getAuthHeader(),
  });

export const deletar = (id) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });

export const listar = listarProdutos;
