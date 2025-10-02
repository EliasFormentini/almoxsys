import axios from "axios";

const API_URL = "http://localhost:3000/api/categorias"; // ajuste se sua API usar outro endpoint

export const listarCategorias = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const salvarCategoria = async (categoria) => {
  const response = await axios.post(API_URL, categoria);
  return response.data;
};

export const atualizarCategoria = async (id, categoria) => {
  const response = await axios.put(`${API_URL}/${id}`, categoria);
  return response.data;
};

export const deletarCategoria = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
