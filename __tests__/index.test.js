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
});

describe("GET /api/reviews", () => {
  test("returns an array of review objects with the correct properties ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("reviews should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("should accept a sort_by query that sorts the data by a specified column (default desc)", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("votes", { descending: true });
      });
  });
  test("should accept an order query that can specifiy asc or desc", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("should accept a category query that filters the data by the given value", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);
        const filtered = reviews.every(
          (review) => review.category === "social deduction"
        );
        expect(filtered).toBe(true);
      });
  });
  test("should return 400 for an invalid query", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=up")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("returns an array of comments for the given review_id each with the correct properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 2,
            })
          );
        });
      });
  });
  test("returns 200 and an empty array when ID is valid and in database but has no referencing comments", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("returns 404 for valid ID not in database", () => {
    return request(app)
      .get("/api/reviews/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found");
      });
  });
  test("returns 400 for an invalid ID", () => {
    return request(app)
      .get("/api/reviews/two/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("adds a comment to database with username and body and returns the added comment", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({ username: "bainesface", body: "test-body" })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            body: "test-body",
            votes: 0,
            author: "bainesface",
            review_id: 5,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("returns 404 for valid ID not in database", () => {
    return request(app)
      .post("/api/reviews/1000/comments")
      .send({ username: "bainesface", body: "test-body" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID or user not found");
      });
  });
  test("returns 404 for usernames not in database", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({ username: "not-a-user", body: "test-body" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID or user not found");
      });
  });
  test("returns 400 for invalid comment object", () => {
    return request(app)
      .post("/api/reviews/5/comments")
      .send({ username: "bainesface", body: undefined })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input format");
      });
  });
  test("returns 400 for invalid review_id", () => {
    return request(app)
      .get("/api/reviews/five/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should delete a comment with the given ID from database and return 204", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments).toHaveLength(2);
          });
      });
  });
  test("returns 404 for a valid ID not in database", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found");
      });
  });
  test("returns 400 for an invalid ID", () => {
    return request(app)
      .delete("/api/comments/five")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
});

describe("GET /api", () => {
  test("returns an array of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toHaveLength(8);
        endpoints.forEach((endpoint) => {
          expect.objectContaining({
            Endpoint: expect.any(String),
            Method: expect.any(String),
            Description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("returns a user object for the requested username", () => {
    return request(app)
      .get("/api/users/bainesface")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: "bainesface",
            name: "sarah",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          })
        );
      });
  });
  test("returns 404 for a username not in the database", () => {
    return request(app)
      .get("/api/users/notauser")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("should update (increase) the number of votes in the specified review object by the amount given and return the object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.votes).toBe(21);
      });
  });
  test("should update (decrease) the number of votes in the specified review object by the amount given and return the object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.votes).toBe(11);
      });
  });
  test("returns 400 when passed an object with invalid number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
  test("returns 400 when passed an object with other invalid formatting", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input format");
      });
  });
  test("returns 400 for an invalid ID", () => {
    return request(app)
      .patch("/api/comments/one")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input or ID");
      });
  });
  test("returns 404 for valid ID not in database", () => {
    return request(app)
      .patch("/api/comments/1000")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

// describe("POST /api/reviews", () => {
//   test("updates the reviews table with the requested review object", () => {
//     return request(app)
//       .post("/api/reviews")
//       .send({
//         owner: "mallionaire",
//         title: "test-title",
//         review_body: "test-body",
//         designer: "test-designer",
//         category: "social deduction",
//       })
//       .expect(201)
//       .then(({ body }) => {
//         const { review } = body;
//         expect(review).toEqual(
//           expect.objectContaining({
//             review_id: 14,
//             owner: "mallionaire",
//             title: "test-title",
//             reivew_body: "test-body",
//             designer: "test-designer",
//             category: "social deduction",
//             vote: 0,
//             created_at: expect.any(String),
//             comment_count: 0,
//           })
//         );
//       });
//   });
//   test("returns 400 for username not existing", () => {
//     return request(app)
//       .post("/api/reviews")
//       .send({
//         owner: "no-username",
//         title: "test-title",
//         reivew_body: "test-body",
//         designer: "test-designer",
//         category: "social deduction",
//       })
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("");
//       });
//   });
//   test("returns 400 for category no existing", () => {
//     return request(app)
//       .post("/api/reviews")
//       .send({
//         owner: "mallionaire",
//         title: "test-title",
//         reivew_body: "test-body",
//         designer: "test-designer",
//         category: "not-a-category",
//       })
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("");
//       });
//   });
//   test("returns 400 for incorrect formatting", () => {
//     return request(app)
//       .post("/api/reviews")
//       .send({
//         ownerr: "mallionaire",
//         title: "test-title",
//         reivew_body: "test-body",
//         designer: "test-designer",
//         category: "not-a-category",
//       })
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("");
//       });
//   });
//   test("returns 400 for missing information", () => {
//     return request(app)
//       .post("/api/reviews")
//       .send({
//         ownerr: "mallionaire",
//         title: undefined,
//         reivew_body: "test-body",
//         designer: "test-designer",
//         category: "not-a-category",
//       })
//       .expect(400)
//       .then(({ body }) => {
//         expect(body.msg).toBe("");
//       });
//   });
// });
