const db = require("./db/connection");
const { selectTopics, selectArticles, selectArticleById } = require("./models");

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Path not found!" });
      }
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  console.log("hi!");
  const { article_id } = request.params;
  const { username, body } = request.body;
  console.log(username, body);

  insertComment(username, body).then((newComment) => {
    response.status(201).send({ comment: newComment });
  });
};
