const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200 - GET: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200 - GET: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 - GET: responds with the appropriate article object using article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Array);
        expect(article).toHaveLength(1);
        expect(article).toMatchObject([
          {
            author: expect.any(String),
            title: expect.any(String),
            article_id: 2,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          },
        ]);
      });
  });
  test("404: responds with a message 'Path not found' when article id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/50")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found!");
      });
  });
  test("400: responds with a message 'Bad request' when path is invalid", () => {
    return request(app)
      .get("/api/articles/not-a-valid-path-because-not-a-number")
      .expect(400)
      .then(({ body }) => {
        console.log(body);
        expect(body.msg).toBe("Bad request!");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200 - GET: responds with an array of comments for given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: responds with a message 'Not found' when article id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/49/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found!");
      });
  });
  test("400: responds with a message 'Bad request' when path is invalid", () => {
    return request(app)
      .get("/api/articles/not-a-valid-path-because-not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("200: responds with an empty array if ID exists but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201 - POST: responds with posted comment when request contains an object of username and body", () => {
    const commentToPost = {
      username: "butter_bridge",
      body: "Live long and prosper",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Live long and prosper",
          article_id: 3,
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("404: responds with a message 'Not found' when article_id is valid but does not exist", () => {
    const commentToPost = {
      username: "butter_bridge",
      body: "Live long and prosper",
    };
    return request(app)
      .post("/api/articles/49/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        expect(body.msg).toBe("Not found!");
      });
  });
  test("404: responds with a message 'User not found' when username is valid but does not exist", () => {
    const commentToPost = {
      username: "somedude27",
      body: "Live long and prosper",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("400: responds with a message 'Bad request!' when passed an invalid path", () => {
    const commentToPost = {
      username: "butter_bridge",
      body: "Live long and prosper",
    };
    return request(app)
      .post("/api/articles/four/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("400: responds with a message 'Missing field' when no username or body sent with request", () => {
    const commentToPost = {};
    return request(app)
      .post("/api/articles/4/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing field!");
      });
  });
});
