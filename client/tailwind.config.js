/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais baseadas no layout ALMOB
        sidebar: "#1e293b", // fundo do menu lateral
        "sidebar-hover": "#334155",
        background: "#f1f5f9", // fundo geral
        surface: "#ffffff", // cartões e blocos brancos
        border: "#e2e8f0", // bordas sutis

        // Textos
        "text-primary": "#111827", // texto principal (quase preto)
        "text-secondary": "#475569", // texto mais suave

        // Cards coloridos
        "card-red": "#dc2626",
        "card-yellow": "#facc15",
        "card-green": "#16a34a",
        "card-purple": "#7c3aed",

        // Elementos de destaque
        primary: "#2563eb",
        secondary: "#1e40af",
      },
      boxShadow: {
        card: "0 2px 6px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
