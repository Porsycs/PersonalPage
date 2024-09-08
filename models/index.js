const { MsSqlDialect } = require("@sequelize/mssql");
const { Sequelize } = require('@sequelize/core');

const sequelize = new Sequelize({
  dialect: 'mssql',
  server: process.env.DB_DIALECT ,
  port: 1433,
  database: process.env.DB_NAME,
  trustServerCertificate: true,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
});

// Exporte o sequelize e os modelos
module.exports = sequelize;
