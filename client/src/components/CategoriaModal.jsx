import React, { useEffect, useState } from "react";
import { useAlert } from "../hooks/useAlert";

const CategoriaModal = ({ isOpen, onClose, onSave, categoriaSelecionada }) => {
  const [nome, setNome] = useState("");

  const { alert, AlertComponent } = useAlert();

  useEffect(() => {
    if (categoriaSelecionada && categoriaSelecionada.nome != null) {
      setNome(categoriaSelecionada.nome);
    } else {
      setNome("");
    }
  }, [categoriaSelecionada, isOpen]);

  const handleChange = (e) => {
    setNome(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = (nome || "").trim();
    if (!trimmed) {
      await alert({
        title: "Nome obrigatório",
        message: "Informe o nome da categoria.",
        type: "warning",
      });
      return;
    }

    onSave({
      id: categoriaSelecionada ? categoriaSelecionada.id : null,
      nome: trimmed,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
          {/* Cabeçalho */}
          <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg text-white font-semibold">
              {categoriaSelecionada ? "Editar Categoria" : "Nova Categoria"}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={nome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Digite o nome da categoria"
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
                {categoriaSelecionada ? "Salvar Alterações" : "Criar Categoria"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {AlertComponent}
    </>
  );
};

export default CategoriaModal;
