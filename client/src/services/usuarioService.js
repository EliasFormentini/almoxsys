import axios from "axios";

const API_URL = "http://localhost:3000/api/usuarios";

export const listarUsuarios = () => axios.get(API_URL);

export const criarUsuario = (usuario) => axios.post(API_URL, usuario);

export const atualizarUsuario = (id, usuario) =>
  axios.put(`${API_URL}/${id}`, usuario);

export const deletarUsuario = (id) =>
  axios.delete(`${API_URL}/${id}`);

export const definirDecks = (id, deckIds) =>
  axios.post(`${API_URL}/${id}/decks`, { deckIds });
