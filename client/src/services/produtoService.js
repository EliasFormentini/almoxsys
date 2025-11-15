// src/services/produtoService.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// LISTAR
export const listar = () => api.get("/produtos");
// compatível com InventarioDetalhePage.jsx
export const listarProdutos = listar;

// CRIAR
export const criar = (produto) => api.post("/produtos", produto);
export const criarProduto = criar;

// ATUALIZAR
export const atualizar = (id, produto) =>
  api.put(`/produtos/${id}`, produto);
export const atualizarProduto = atualizar;

// DELETAR
export const deletar = (id) => api.delete(`/produtos/${id}`);
export const deletarProduto = deletar;
