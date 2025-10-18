import axios from "axios";

const API_URL = "http://localhost:3000/api/fornecedores";

export const listar = () => axios.get(API_URL);
export const buscarPorId = (id) => axios.get(`${API_URL}/${id}`);
export const criar = (fornecedor) => axios.post(API_URL, fornecedor);
export const atualizar = (id, fornecedor) => axios.put(`${API_URL}/${id}`, fornecedor);
export const deletar = (id) => axios.delete(`${API_URL}/${id}`);
