const db = require("./db/connection");

exports.errorHandler400 = (err, request, response, next) => {
  if (err.code === "23502") {
    response.status(400).send({ msg: "Missing field!" });
  } else if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request!" });
  } else {
    next(err);
  }
};

exports.errorHandler500 = (err, request, response, next) => {
  response.status(500).send({ msg: "Server error" });
};

exports.errorHandler404 = (err, request, response, next) => {
  if (err.msg === "Not found!") {
    response.status(404).send({ msg: "Not found!" });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "User not found" });
  } else {
    next(err);
  }
};
