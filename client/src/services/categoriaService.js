import axios from "axios";

const API_URL = "http://localhost:3000/api/categorias";

export const listar = () => axios.get(API_URL);

export const criar = (categoria) => axios.post(API_URL, categoria);

export const atualizar = (id, categoria) =>
  axios.put(`${API_URL}/${id}`, categoria);

export const deletar = (id) => axios.delete(`${API_URL}/${id}`);
