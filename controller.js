const db = require("./db/connection");
const {
  selectTopics,
  selectArticles,
  selectArticleById,
  insertComment,
  selectCommentsByArticleId,
  selectUsers,
  updateArticleVotes,
  deleteCommentById,
  selectUserByUsername,
} = require("./models");
const fs = require("fs/promises");

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
  const { topic, sort_by, order } = request.query;

  const topicCheck = selectTopics(topic);
  const selectedArticles = selectArticles(topic, sort_by, order);

  Promise.all([topicCheck, selectedArticles])
    .then(([topic, articles]) => {
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
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const commentToPost = request.body;

  insertComment(article_id, commentToPost)
    .then((newComment) => {
      response.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (request, response, next) => {
  const { article_id } = request.params;
  const voteChange = request.body.inc_votes;

  const articleIdCheck = selectArticleById(article_id);
  const updatedArticleVotes = updateArticleVotes(article_id, voteChange);

  Promise.all([articleIdCheck, updatedArticleVotes])
    .then(([article, updatedArticle]) => {
      response.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  selectUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;

  deleteCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (request, response, next) => {
  fs.readFile(`./endpoints.json`)
    .then((data) => {
      const endpoints = JSON.parse(data);
      response.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
