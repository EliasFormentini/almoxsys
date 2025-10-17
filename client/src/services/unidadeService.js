import axios from "axios";

const API_URL = "http://localhost:3000/api/unidades";

export const listar = () => axios.get(API_URL);

export const criar = (unidade) => axios.post(API_URL, unidade);

export const atualizar = (id, unidade) =>
  axios.put(`${API_URL}/${id}`, unidade);

export const deletar = (id) => axios.delete(`${API_URL}/${id}`);
