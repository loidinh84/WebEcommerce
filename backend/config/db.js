const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectOptions: {
      option: {
        encrypt: false,
        trustSeverCertificate: true,
      },
    },
    logging: false,
  },
);

module.exports = sequelize;
