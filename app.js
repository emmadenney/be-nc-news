const db = require("./db/connection");
const express = require("express");
const app = express();
const { errorHandler500 } = require("./error-handling");
const { getTopics } = require("./controller");

// app.use(express.json());

// app.use((err, request, response, next) => {
//   next();
// });

app.get("/api/topics", getTopics);

// app.use(errorHandler500);

module.exports = app;
