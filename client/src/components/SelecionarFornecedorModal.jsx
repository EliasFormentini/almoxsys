import React, { useEffect, useState } from "react";
import axios from "axios";

const SelecionarFornecedorModal = ({ isOpen, onClose, onSelect }) => {
  const [fornecedores, setFornecedores] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    if (isOpen) carregarFornecedores();
  }, [isOpen]);

  const carregarFornecedores = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/fornecedores");
      setFornecedores(res.data);
    } catch (err) {
      console.error("Erro ao carregar fornecedores:", err);
    }
  };

  const fornecedoresFiltrados = fornecedores.filter(
    (f) =>
      f.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      f.cnpj?.includes(filtro)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Selecionar Fornecedor</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Filtrar por nome ou CNPJ..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
        />

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">CNPJ</th>
              <th className="p-2 border">Telefone</th>
              <th className="p-2 border">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {fornecedoresFiltrados.map((f) => (
              <tr
                key={f.id}
                onClick={() => onSelect(f)}
                className="cursor-pointer hover:bg-blue-100 transition"
              >
                <td className="p-2 border">{f.nome}</td>
                <td className="p-2 border">{f.cnpj || "—"}</td>
                <td className="p-2 border">{f.telefone || "—"}</td>
                <td className="p-2 border">{f.email || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelecionarFornecedorModal;
