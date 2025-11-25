import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getDashboardResumo = () => {
  return axios.get(`${API_URL}/dashboard`);
};
