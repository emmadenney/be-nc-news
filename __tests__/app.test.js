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

describe("/api/topics", () => {
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

describe("/api/articles", () => {
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

describe("/api/articles/:article_id", () => {
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
  test("404: responds with a message 'Path not found' when path is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/50")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
  test("400: responds with a message 'Invalid path' when path is invalid", () => {
    return request(app)
      .get("/api/articles/not-a-valid-path-because-not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
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
  test("404: responds with a message 'Path not found' when path is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/49/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
  test.skip("200: responds with an empty array if ID exists but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
  // test.only("400: responds with a message 'Invalid path' when path is invalid", () => {
  //   return request(app)
  //     .get("/api/articles/not-a-valid-path-because-not-a-number/123")
  //     .expect(400)
  //     .then(({ body }) => {
  //       console.log(body);
  //       expect(body.msg).toBe("Invalid path!");
  //     });
  // });
});
