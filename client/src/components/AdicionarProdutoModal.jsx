import React, { useState, useEffect } from "react";

/**
 * Props:
 * - isOpen: boolean
 * - produto: { id, nome, custo_medio? }
 * - modo: "entrada" | "saida"
 * - onConfirm(item) -> { id_produto, nome, quantidade, valor_unitario, valor_total }
 * - onClose()
 */
const AdicionarProdutoModal = ({ isOpen, produto, modo = "entrada", onConfirm, onClose }) => {
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const valorUnitarioSaida = produto?.custo_medio ?? 0;
  const isSaida = modo === "saida";

  useEffect(() => {
    if (isOpen) {
      setQuantidade("");
      setValorUnitario(isSaida ? String(Number(valorUnitarioSaida).toFixed(2)) : "");
    }

  }, [isOpen, isSaida, valorUnitarioSaida]);

  if (!isOpen || !produto) return null;

  const valorUnit =
    isSaida ? Number(valorUnitarioSaida) : (parseFloat(valorUnitario) || 0);
  const qtd = parseFloat(quantidade) || 0;
  const valorTotal = qtd * valorUnit;

  const handleSalvar = () => {
    if (!qtd || (!isSaida && !valorUnit)) {
      alert(isSaida ? "Informe a quantidade." : "Informe a quantidade e o valor unitário.");
      return;
    }

    onConfirm({
      id_produto: produto.id,
      nome: produto.nome,
      quantidade: qtd,
      valor_unitario: valorUnit,   
      valor_total: valorTotal,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {isSaida ? "Adicionar Produto (Saída)" : "Adicionar Produto"}
          </h2>
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
            <label className="block text-sm text-gray-700 mb-1">
              Valor Unitário {isSaida && "(custo médio)"}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={isSaida ? Number(valorUnitarioSaida).toFixed(2) : valorUnitario}
              onChange={(e) => !isSaida && setValorUnitario(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 ${isSaida ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder={isSaida ? "Custo médio do produto" : "Informe o valor unitário"}
              disabled={isSaida}
              readOnly={isSaida}
            />
            {isSaida && (
              <p className="text-xs text-gray-500 mt-1">
                O valor unitário é definido automaticamente pelo custo médio do produto.
              </p>
            )}
          </div>

          <div className="text-right mt-3 text-gray-800">
            <span className="font-semibold">Valor Total: </span>
            <span className="text-blue-700 font-bold">R$ {valorTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end border-t px-5 py-3 space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
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
