// src/models/usuarioDeck.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UsuarioDeck = sequelize.define(
    "UsuarioDeck",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_deck: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "UsuariosDecks",
      timestamps: false,
    }
  );

  return UsuarioDeck;
};
