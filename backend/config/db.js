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
        encrypt: false, //để false khi chạy trên máy cá nhân
        trustSeverCertificate: true,
      },
    },
    logging: false, //Tắt log các câu lệnh SQL
  },
);

module.exports = sequelize;
