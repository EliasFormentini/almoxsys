require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

const { sequelize } = require("./src/models");


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

