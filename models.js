const db = require("./db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const allowedOptions = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
    "asc",
    "desc",
    "ASC",
    "DESC",
  ];

  const queryParams = [];

  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (topic !== undefined) {
    queryString += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  if (!allowedOptions.includes(sort_by) || !allowedOptions.includes(order)) {
    return Promise.reject({ status: 404, msg: "Invalid input!" });
  }

  queryString += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order};`;

  return db.query(queryString, queryParams).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return result.rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1 GROUP BY comments.comment_id ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (article_id, commentToPost) => {
  const { username, body } = commentToPost;

  return db
    .query(
      `INSERT INTO comments
      (body, article_id, author, votes)
      VALUES
      ($1, $2, $3, 0) RETURNING *;`,
      [body, article_id, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticleVotes = (article_id, voteChange) => {
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [voteChange, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};
