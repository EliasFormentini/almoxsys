import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const resp = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        senha,
      });

      const { token: novoToken, usuario: user } = resp.data;

      setToken(novoToken);
      setUsuario(user);

      localStorage.setItem("token", novoToken);
      localStorage.setItem("usuario", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${novoToken}`;
    } catch (error) {
      console.error("Erro ao fazer login:", error.response?.data || error);

      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Falha ao fazer login. Verifique e-mail e senha.";

      throw new Error(msg);
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
