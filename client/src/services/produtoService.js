import axios from "axios";

const API_URL = "http://localhost:3000/api/produtos";

export const listar = () => axios.get(API_URL);

export const criar = (produto) => axios.post(API_URL, produto);

export const atualizar = (id, produto) => axios.put(`${API_URL}/${id}`, produto);

export const deletar = (id) => axios.delete(`${API_URL}/${id}`);
