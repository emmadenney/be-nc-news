const db = require("./db/connection");
const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  selectVotesByArticleId,
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

exports.updateVotes = (request, response, next) => {
  const { article_id } = request.params;
  const voteChange = request.body;

  const articleIdCheck = selectArticleById(article_id);
  const votesCheck = selectVotesByArticleId(article_id);

  Promise.all([articleIdCheck, votesCheck])
    .then(([article, votes]) => {
      console.log(article, votes);
      votes.total_votes += voteChange.inc_votes;
      const updatedArticle = article[0];
      updatedArticle.votes = votes.total_votes;
      response.status(201).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
