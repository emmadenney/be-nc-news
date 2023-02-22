const db = require("./db/connection");
const express = require("express");
const app = express();
const {
  errorHandler500,
  errorHandler404,
  errorHandlerPSQL400,
} = require("./error-handling.js");
const {
  getTopics,
  getArticles,
  getArticleById,
  getComments,
  updateVotes,
} = require("./controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getComments);

app.patch("/api/articles/:article_id", updateVotes);

// need an app.use(3) or app.all to catch the default 404 that express will invoke if none of the endpoints are matched

// change my 404 errors to 'custom404 handlers'
app.use(errorHandlerPSQL400);
app.use(errorHandler404);
app.use(errorHandler500);

module.exports = app;
