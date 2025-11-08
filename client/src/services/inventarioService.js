// src/services/inventarioService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/inventario";

export const listarInventarios = () => axios.get(API_URL);

export const abrirInventario = () => axios.post(API_URL);

export const getInventarioById = (id) => axios.get(`${API_URL}/${id}`);

export const concluirInventario = (id, itens) =>
  axios.post(`${API_URL}/${id}/concluir`, { itens });
