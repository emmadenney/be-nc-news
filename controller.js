const db = require("./db/connection");
const { selectTopics } = require("./models");

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.send({ topics });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
