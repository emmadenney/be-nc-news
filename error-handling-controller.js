exports.errorHandler500 = (err, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server error!" });
};

exports.errorHandler404 = (err, request, response, next) => {
  console.log(error);
  response.status(404).send({ msg: "Bad request" });
};
