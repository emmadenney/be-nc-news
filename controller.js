const db = require("./db/connection");
const {
  selectTopics,
  selectArticles,
  selectArticleById,
  insertComment,
  selectCommentsByArticleId,
  selectUsers,
  updateArticleVotes,
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
  const { topic } = request.query;

  selectArticles(topic)
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
