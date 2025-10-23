import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const SelecionarFornecedorModal = ({ isOpen, onSelect, onClose }) => {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollBottom, setScrollBottom] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) carregarFornecedores();
  }, [isOpen]);

  const carregarFornecedores = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/fornecedores");
      setFornecedores(res.data || []);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };

  const fornecedoresFiltrados = fornecedores.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cnpj?.toLowerCase().includes(busca.toLowerCase())
  );

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setScrollTop(el.scrollTop);
      setScrollBottom(el.scrollHeight - el.scrollTop === el.clientHeight);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Selecionar Fornecedor</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-200">
            ✕
          </button>
        </div>

        {/* Campo de busca */}
        <div className="p-4 border-b">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar por nome ou CNPJ..."
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Container com rolagem e sombras dinâmicas */}
        <div className="relative flex-1">
          {/* Fade top */}
          {scrollTop > 0 && (
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-200/80 to-transparent pointer-events-none z-10" />
          )}

          {/* Conteúdo rolável */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto max-h-[55vh] scroll-smooth"
          >
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">CNPJ</th>
                  <th className="border p-2 text-left">Telefone</th>
                  <th className="border p-2 text-left">E-mail</th>
                </tr>
              </thead>
              <tbody>
                {fornecedoresFiltrados.length > 0 ? (
                  fornecedoresFiltrados.map((f) => (
                    <tr
                      key={f.id}
                      className="hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => onSelect && onSelect(f)}
                    >
                      <td className="border p-2">{f.nome}</td>
                      <td className="border p-2">{f.cnpj || "—"}</td>
                      <td className="border p-2">{f.telefone || "—"}</td>
                      <td className="border p-2">{f.email || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-4">
                      Nenhum fornecedor encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Fade bottom */}
          {!scrollBottom && fornecedoresFiltrados.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-200/70 to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* Rodapé */}
        <div className="border-t p-3 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelecionarFornecedorModal;
