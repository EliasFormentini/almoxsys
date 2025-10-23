import React, { useState, useEffect } from "react";
import axios from "axios";

const SelecionarProdutoModal = ({ isOpen, onSelect, onClose }) => {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (isOpen) carregarProdutos();
  }, [isOpen]);

  const carregarProdutos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/produtos");
      setProdutos(res.data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.id.toString().includes(busca)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Selecionar Produto</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar por nome ou código..."
            className="border rounded-md px-3 py-2 w-full mb-3"
          />

          <div className="max-h-80 overflow-y-auto border rounded-md">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">Categoria</th>
                  <th className="border p-2 text-center">Unidade</th>
                  <th className="border p-2 text-center">Estoque</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto) => (
                    <tr
                      key={produto.id}
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => onSelect && onSelect(produto)} // ✅ garante que onSelect é função
                    >
                      <td className="border p-2">{produto.id}</td>
                      <td className="border p-2">{produto.nome}</td>
                      <td className="border p-2">
                        {produto.categoria?.nome || "—"}
                      </td>
                      <td className="border p-2 text-center">
                        {produto.unidade_medida || "—"}
                      </td>
                      <td className="border p-2 text-center">
                        {produto.estoque_atual}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-3">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelecionarProdutoModal;
