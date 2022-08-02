const db = require("../db/connection");
const checkExists = require("../utils/check-exists");

afterAll(() => {
  return db.end();
});

describe("checkExists", () => {
  test("returns an empty array when value exists in table", () => {
    return checkExists("reviews", "review_id", 5).then((body) => {
      expect(body).toEqual([]);
    });
  });
  test("returns 404 when value does not exist in table", () => {
    return checkExists("reviews", "review_id", 100)
      .then((body) => {})
      .catch((err) => {
        expect(err).toEqual({ status: 404, msg: "Resource not found" });
      });
  });
});
