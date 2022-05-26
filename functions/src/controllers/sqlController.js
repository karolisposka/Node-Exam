const mysql = require("mysql2/promise");
const { mysqlConfig } = require("../config");

module.exports = async (text) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(text);
    await con.end();
    return data;
  } catch (err) {
    return err;
  }
};
