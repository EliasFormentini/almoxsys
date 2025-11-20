import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const listarPedidos = () => {
  return axios.get(`${API_URL}/pedidos`);
};

export const criarPedido = (pedido) => {
  return axios.post(`${API_URL}/pedidos`, pedido);
};

export const atualizarPedido = (id, dados) => {
  return axios.put(`${API_URL}/pedidos/${id}`, dados);
};

export const excluirPedido = (id) => {
  return axios.delete(`${API_URL}/pedidos/${id}`);
};

export const atualizarStatusPedido = (id, status) => {
  return axios.put(`${API_URL}/pedidos/${id}/status`, { status });
};
