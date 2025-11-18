"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UsuariosDecks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_deck: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "DecksPermissao",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    // evita duplicar mesmo deck no mesmo usuário
    await queryInterface.addConstraint("UsuariosDecks", {
      type: "unique",
      fields: ["id_usuario", "id_deck"],
      name: "uniq_usuario_deck",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("UsuariosDecks");
  },
};
