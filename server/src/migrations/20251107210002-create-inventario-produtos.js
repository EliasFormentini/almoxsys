"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventario_produtos", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      id_inventario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Inventarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      id_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Produtos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      qtd_correta: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });

    // evita duplicar o mesmo produto dentro do mesmo inventário
    await queryInterface.addConstraint("inventario_produtos", {
      fields: ["id_inventario", "id_produto"],
      type: "unique",
      name: "uniq_inventario_produto",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inventario_produtos");
  },
};
