const db = require("./db/connection");

exports.errorHandler400s = (err, request, response, next) => {
  if (err.code === "23502") {
    response.status(400).send({ msg: "Missing field!" });
  } else if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request!" });
  } else if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.errorHandler404s = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "Not found!" });
  } else {
    next(err);
  }
};

exports.errorHandler500s = (err, request, response, next) => {
  response.status(500).send({ msg: "Server error" });
};
