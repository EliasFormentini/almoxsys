const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Usuario", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    perfil: { 
      type: DataTypes.ENUM("administrador", "almoxarife", "funcionario"), 
      allowNull: false 
    },
  }, {
    tableName: "Usuarios",
    timestamps: false,
  });
};
