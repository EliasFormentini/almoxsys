// // src/services/produtoService.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
// });

// // LISTAR
// export const listar = () => api.get("/produtos");
// // compatível com InventarioDetalhePage.jsx
// export const listarProdutos = listar;

// // CRIAR
// export const criar = (produto) => api.post("/produtos", produto);
// export const criarProduto = criar;

// // ATUALIZAR
// export const atualizar = (id, produto) =>
//   api.put(`/produtos/${id}`, produto);
// export const atualizarProduto = atualizar;

// // DELETAR
// export const deletar = (id) => api.delete(`/produtos/${id}`);
// export const deletarProduto = deletar;


// src/services/produtoService.js
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

// compatível com páginas antigas
export const listar = listarProdutos;
