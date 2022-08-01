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
