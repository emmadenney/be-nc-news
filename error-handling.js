const db = require("./db/connection");

exports.errorHandler500 = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Server error" });
};
