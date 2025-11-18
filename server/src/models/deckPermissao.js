// src/models/deckPermissao.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DeckPermissao = sequelize.define(
    "DeckPermissao",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      descricao: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      // string JSON com array de permissões, ex: ["PRODUTOS_VER","ESTOQUE_EDITAR"]
      permissoes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]",
        get() {
          const raw = this.getDataValue("permissoes") || "[]";
          try {
            return JSON.parse(raw);
          } catch {
            return [];
          }
        },
        set(value) {
          this.setDataValue(
            "permissoes",
            Array.isArray(value) ? JSON.stringify(value) : "[]"
          );
        },
      },
    },
    {
      tableName: "DecksPermissao",
      timestamps: false,
    }
  );

  return DeckPermissao;
};
