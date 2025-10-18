import React, { useEffect, useState } from "react";
import axios from "axios";

const SelecionarProdutoModal = ({ isOpen, onClose, onSelect }) => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    if (isOpen) carregarProdutos();
  }, [isOpen]);

  const carregarProdutos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.id.toString().includes(filtro)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Selecionar Produto
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Filtrar por nome ou código..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
        />

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">Categoria</th>
              <th className="p-2 border">Unidade</th>
              <th className="p-2 border">Estoque</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect(p)}
                className="cursor-pointer hover:bg-blue-100 transition"
              >
                <td className="p-2 border text-center">{p.id}</td>
                <td className="p-2 border">{p.nome}</td>
                <td className="p-2 border">{p.Categoria?.nome}</td>
                <td className="p-2 border">{p.Unidade?.sigla}</td>
                <td className="p-2 border text-center">{p.estoque_atual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelecionarProdutoModal;
