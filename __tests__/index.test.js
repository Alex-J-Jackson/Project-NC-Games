const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  test("returns an array of all categories, each with slug and description properties, with status code 200", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        const correctCatetgories = categories.every(
          (category) => "slug" in category && "description" in category
        );
        expect(correctCatetgories).toBe(true);
      });
  });
  test("returns error 404 when client inputs an incorrect route", () => {
    return request(app)
      .get("/api/categorys")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("returns a review object with the specified id and correct properties ", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 3,
            title: "Ultimate Werewolf",
            review_body: "We couldn't find the werewolf!",
            designer: "Akihisa Okui",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 5,
            category: "social deduction",
            owner: "bainesface",
            created_at: "2021-01-18T10:01:41.251Z",
          })
        );
      });
  });
  test("review object should have a comment_count property giving the total number of comments with the given review_id", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review.comment_count).toBe("3");
      });
  });
  test("returns error 400 when client inputs an invalid id", () => {
    return request(app)
      .get("/api/reviews/twelve")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
  test("returns error 404 when client inputs a valid id not in the database", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("should update (increase) the number of votes in the specified review object by the amount given and return the object", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review.votes).toBe(12);
      });
  });
  test("should update (decrease) the number of votes in the specified review object by the amount given and return the object", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review.votes).toBe(2);
      });
  });
  test("returns 400 when passed an object with invalid number", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
  test("returns 400 when passed an object with other invalid formatting", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input format");
      });
  });
  // test("returns 400 when votes would update to a negative number", () => {
  //   return request(app)
  //     .patch("/api/reviews/4")
  //     .send({ inc_votes: -15 })
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe(
  //         "No. of votes cannot be negative: current vote count is: 7"
  //       );
  //     });
  // });
  test("returns 400 for an invalid ID", () => {
    return request(app)
      .patch("/api/reviews/four")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
  test("returns 404 for valid ID not in database", () => {
    return request(app)
      .patch("/api/reviews/100")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

describe("GET /api/users", () => {
  test("returns and array of objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("returns error 404 when client inputs an incorrect route", () => {
    return request(app)
      .get("/api/usrs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
