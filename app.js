const db = require("./db/connection");
const express = require("express");
const app = express();
const {
  errorHandler500,
  errorHandler404,
} = require("./error-handling-controller.js");
const { getTopics, getArticles } = require("./controller");

app.use((err, request, response, next) => {
  next();
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use(errorHandler500);
app.use(errorHandler404);

module.exports = app;
