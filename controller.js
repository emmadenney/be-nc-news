const db = require("./db/connection");
const {
  selectTopics,
  selectArticles,
  selectArticleById,
  insertComment,
  selectCommentsByArticleId,
} = require("./models");

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

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;

  const articleIdCheck = selectArticleById(article_id);
  const selectComments = selectCommentsByArticleId(article_id);

  Promise.all([articleIdCheck, selectComments])
    .then(([article, comments]) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Path not found!" });
      }
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const commentToPost = request.body;

  const articleIdCheck = selectArticleById(article_id);
  const insertedComment = insertComment(article_id, commentToPost);

  Promise.all([articleIdCheck, insertedComment])
    .then(([article, newComment]) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Path not found!" });
      } else if (newComment.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      response.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};
