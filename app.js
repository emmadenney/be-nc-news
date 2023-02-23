const db = require("./db/connection");
const express = require("express");
const app = express();
const {
  errorHandler500,
  errorHandler404,
  errorHandler400,
} = require("./error-handling.js");
const {
  getTopics,
  getArticles,
  getArticleById,
  postComment,
  getComments,
} = require("./controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.use(errorHandler400);
app.use(errorHandler404);
app.use(errorHandler500);

module.exports = app;
