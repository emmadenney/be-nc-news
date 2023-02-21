const db = require("./db/connection");

exports.errorHandlerPSQL400 = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid path!" });
  } else {
    next(err);
  }
};

exports.errorHandler500 = (err, request, response, next) => {
  response.status(500).send({ msg: "Server error" });
};

exports.errorHandler404 = (err, request, response, next) => {
  if (err.msg === "Path not found!") {
    response.status(404).send({ msg: "Path not found!" });
  } else {
    next(err);
  }
};

exports.errorHandlerPSQL404 = (err, request, response, next) => {
  if (err.code === "23503") {
    response.status(404).send({ msg: "User not found" });
  } else {
    next(err);
  }
};
