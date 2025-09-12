require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "almox_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME_TEST || "almox_db_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME_PROD || "almox_db_prod",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  }
};
