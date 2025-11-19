import axios from "axios";

const API_URL = "http://localhost:3000/api/usuarios";

export const listarUsuarios = () => axios.get(API_URL);
export const criarUsuario = (dados) => axios.post(API_URL, dados);
export const atualizarUsuario = (id, dados) => axios.put(`${API_URL}/${id}`, dados);
export const deletarUsuario = (id) => axios.delete(`${API_URL}/${id}`);

export const definirDecks = (usuarioId, deckKeys) =>
  axios.put(`${API_URL}/${usuarioId}/decks`, { decks: deckKeys });
