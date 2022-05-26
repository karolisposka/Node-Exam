require("dotenv").config();

module.exports = {
  port: process.env.SERVER_PORT,
  mysqlConfig: {
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
  },
  jwtCode: process.env.JWT_CODE,
};
