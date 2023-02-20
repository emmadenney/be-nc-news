const db = require("./db/connection");

exports.errorHandler500 = (err, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server error" });
};

exports.errorHandler400 = (err, request, response, next) => {
  console.log(error);
  response.status(400).send({ msg: "Bad request" });
};
