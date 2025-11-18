import axios from "axios";

const API_URL = "http://localhost:3000/api/decks-permissao";

export const listarDecks = () => axios.get(API_URL);
