const format = require("pg-format");
const db = require("../db/connection");

const checkExists = (table, column, value) => {
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  return db.query(queryStr, [value]).then(({ rows: output }) => {
    if (!output.length) {
      return Promise.reject({ status: 404, msg: "Resource not found" });
    } else {
      return [];
    }
  });
};

module.exports = checkExists;
