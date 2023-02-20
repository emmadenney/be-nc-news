const db = require("./db/connection");

exports.selectArticles = () => {};

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};
