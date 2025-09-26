"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const senhaCriptografada = await bcrypt.hash("admin123", 10);

    await queryInterface.bulkInsert("Usuarios", [
      {
        nome: "Administrador",
        email: "admin@almoxsys.com",
        senha: senhaCriptografada,
        perfil: "admin", 
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Usuarios", { email: "admin@almoxsys.com" });
  },
};
