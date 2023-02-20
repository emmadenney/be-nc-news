const db = require("./db/connection");
const express = require("express");
const app = express();
const { errorHandler500 } = require("./error-handling-controller.js");
const { getTopics, getArticles } = require("./controller");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use(errorHandler500);

module.exports = app;
