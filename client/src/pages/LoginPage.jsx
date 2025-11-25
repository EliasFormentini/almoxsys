import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import logo from "../../public/favicon.png"; // <--- coloque aqui o caminho correto

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, senha);
      showToast({ type: "success", message: "Bem-vindo!" });
      navigate("/");
    } catch (err) {
      showToast({
        type: "error",
        title: "Erro ao entrar",
        message: err.response?.data?.error || "Login inválido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">


      <div className="absolute -top-20 -left-32 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full" />

      <div
        className="
        relative z-10
        w-full max-w-md
        p-10
        rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        shadow-xl
      "
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="AlmoxSys"
            className="w-24 h-24 object-contain mb-2 drop-shadow-xl"
          />
          <h1 className="text-2xl font-semibold tracking-[0.2em] text-white">
            ALMOX<span className="text-blue-300">SYS</span>
          </h1>
          <p className="text-xs text-slate-200/70 mt-1">
            Sistema de Gestão de Almoxarifado
          </p>
        </div>


        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-100 mb-1">E-mail</label>
            <input
              type="email"
              className="
                w-full px-3 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-slate-50 placeholder:text-slate-300/60
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-100 mb-1">Senha</label>
            <input
              type="password"
              className="
                w-full px-3 py-2 rounded-lg
                bg-white/10 border border-white/20
                text-slate-50 placeholder:text-slate-300/60
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              "
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-2 py-2.5 rounded-lg
              bg-blue-600/90 hover:bg-blue-500
              text-white font-semibold tracking-wide
              shadow-lg shadow-blue-900/40
              transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-slate-200/60">
            © {new Date().getFullYear()} AlmoxSys • Controle eficiente de estoque
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;