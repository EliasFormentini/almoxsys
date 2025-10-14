import React, { useEffect, useState } from "react";

const CategoriaModal = ({ isOpen, onClose, onSave, categoriaSelecionada }) => {
    const [nome, setDescricao] = useState("");

    useEffect(() => {
        if (categoriaSelecionada) {
            setDescricao(categoriaSelecionada.nome);
        } else {
            setDescricao("");
        }
    }, [categoriaSelecionada]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nome.trim()) return alert("Informe uma descrição.");

        onSave({
            id: categoriaSelecionada ? categoriaSelecionada.id : null,
            descricao: nome.trim(),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        {categoriaSelecionada ? "Editar Categoria" : "Nova Categoria"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white text-xl leading-none hover:text-gray-200"
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
                            name="nome"
                            value={categoria.nome || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Digite a descrição da categoria"
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
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {categoriaSelecionada ? "Salvar Alterações" : "Criar Categoria"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoriaModal;
