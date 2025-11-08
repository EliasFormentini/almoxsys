// src/services/produtoService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/produtos";

// compatível com InventarioDetalhePage.jsx
export const listarProdutos = () => axios.get(API_URL);

// demais operações CRUD
export const criarProduto = (produto) => axios.post(API_URL, produto);
export const atualizarProduto = (id, produto) => axios.put(`${API_URL}/${id}`, produto);
export const deletarProduto = (id) => axios.delete(`${API_URL}/${id}`);
export const listar = listarProdutos;
