const db = require("./db/connection");

exports.errorHandlerPSQL400 = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid path!" });
  } else {
    next(err);
  }
};

exports.errorHandler500 = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Server error" });
};

exports.errorHandler404 = (err, request, response, next) => {
  response.status(404).send({ msg: "Path not found!" });
};
