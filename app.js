const db = require("./db/connection");
const express = require("express");
const app = express();
const {
  errorHandler404s,
  errorHandler400s,
  errorHandler500s,
} = require("./error-handling.js");
const {
  getTopics,
  getArticles,
  getArticleById,
  postComment,
  getComments,
  getUsers,
  updateVotes,
  deleteComment,
} = require("./controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", updateVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (request, response, next) => {
  response.status(404).send({ msg: "Not found!" });
});

app.use(errorHandler400s);
app.use(errorHandler404s);
app.use(errorHandler500s);

module.exports = app;
