import React, { useEffect, useState } from "react";

const UsuarioModal = ({
  isOpen,
  onClose,
  onSave,
  usuarioSelecionado,
  decksDisponiveis = [],
}) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("usuario");
  const [deckIdsSelecionados, setDeckIdsSelecionados] = useState([]);

  useEffect(() => {
    if (usuarioSelecionado) {
      setNome(usuarioSelecionado.nome || "");
      setEmail(usuarioSelecionado.email || "");
      setPerfil(usuarioSelecionado.perfil || "usuario");
      setSenha("");
      setDeckIdsSelecionados(
        (usuarioSelecionado.decks || []).map((d) => d.id)
      );
    } else {
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("usuario");
      setDeckIdsSelecionados([]);
    }
  }, [usuarioSelecionado, isOpen]);

  if (!isOpen) return null;

  const toggleDeck = (idDeck) => {
    setDeckIdsSelecionados((prev) =>
      prev.includes(idDeck)
        ? prev.filter((id) => id !== idDeck)
        : [...prev, idDeck]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nomeTrim = (nome || "").trim();
    const emailTrim = (email || "").trim();

    if (!nomeTrim || !emailTrim) {
      return onSave({
        __validationError: "Informe nome e e-mail.",
      });
    }

    const payload = {
      id: usuarioSelecionado ? usuarioSelecionado.id : null,
      nome: nomeTrim,
      email: emailTrim,
      perfil,
      senha: undefined, 
      deckIds: deckIdsSelecionados,
    };

    if (senha.trim()) {
      payload.senha = senha.trim();
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {usuarioSelecionado ? "Editar Usuário" : "Novo Usuário"}
          </h2>
          <button
            onClick={onClose}
            className="text-white text-xl leading-none hover:text-gray-200"
            type="button"
          >
            &times;
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nome do usuário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={
                  usuarioSelecionado
                    ? "Deixe em branco para manter"
                    : "Defina uma senha"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil
              </label>
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="admin">Administrador</option>
                <option value="usuario">Usuário</option>
              </select>
            </div>
          </div>

          {/* Decks de permissão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decks de permissão
            </label>
            {decksDisponiveis.length ? (
              <div className="border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto bg-gray-50">
                {decksDisponiveis.map((deck) => (
                  <label
                    key={deck.id}
                    className="flex items-center gap-2 text-sm py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={deckIdsSelecionados.includes(deck.id)}
                      onChange={() => toggleDeck(deck.id)}
                    />
                    <span className="font-medium text-gray-800">
                      {deck.nome}
                    </span>
                    {deck.descricao && (
                      <span className="text-xs text-gray-500">
                        – {deck.descricao}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Nenhum deck de permissão cadastrado.
              </p>
            )}
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
              {usuarioSelecionado ? "Salvar Alterações" : "Criar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;
