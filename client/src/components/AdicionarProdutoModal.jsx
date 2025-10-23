import React, { useState, useEffect } from "react";

const AdicionarProdutoModal = ({ isOpen, produto, onConfirm, onClose }) => {
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuantidade("");
      setValorUnitario("");
    }
  }, [isOpen]);

  if (!isOpen || !produto) return null;

  const valorTotal =
    (parseFloat(quantidade) || 0) * (parseFloat(valorUnitario) || 0);

  const handleSalvar = () => {
    if (!quantidade || !valorUnitario) {
      alert("Informe a quantidade e o valor unitário.");
      return;
    }

    onConfirm({
      id_produto: produto.id,
      nome: produto.nome,
      quantidade: parseFloat(quantidade),
      valor_unitario: parseFloat(valorUnitario),
      valor_total: valorTotal,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Adicionar Produto</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="font-medium text-gray-700">
            Produto selecionado:{" "}
            <span className="text-blue-700 font-semibold">{produto.nome}</span>
          </p>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Quantidade</label>
            <input
              type="number"
              min="0"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Informe a quantidade"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Valor Unitário (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Informe o valor unitário"
            />
          </div>

          <div className="text-right mt-3 text-gray-800">
            <span className="font-semibold">Valor Total: </span>
            <span className="text-blue-700 font-bold">
              R$ {valorTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-end border-t px-5 py-3 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdicionarProdutoModal;
