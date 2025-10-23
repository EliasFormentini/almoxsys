import React, { useEffect, useState } from "react";

const UnidadeModal = ({ isOpen, onClose, onSave, unidadeSelecionada }) => {
  const [sigla, setSigla] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (unidadeSelecionada) {
      setSigla(unidadeSelecionada.sigla || "");
      setDescricao(unidadeSelecionada.descricao || "");
    } else {
      setSigla("");
      setDescricao("");
    }
  }, [unidadeSelecionada, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const s = (sigla || "").trim();
    const d = (descricao || "").trim();
    if (!s || !d) {
      alert("Informe a sigla e a descrição da unidade.");
      return;
    }
    onSave({
      id: unidadeSelecionada ? unidadeSelecionada.id : null,
      sigla: s,
      descricao: d,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg text-white font-semibold">
            {unidadeSelecionada ? "Editar Unidade" : "Nova Unidade"}
          </h2>
          <button
            onClick={onClose}
            className="text-white text-xl leading-none hover:text-gray-200"
            aria-label="Fechar"
            type="button"
          >
            &times;
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Digite a descrição da unidade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sigla
            </label>
            <input
              type="text"
              value={sigla}
              onChange={(e) => setSigla(e.target.value.toUpperCase().slice(0, 3))}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Digite a sigla da unidade"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
            >
              {unidadeSelecionada ? "Salvar Alterações" : "Criar Unidade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnidadeModal;
