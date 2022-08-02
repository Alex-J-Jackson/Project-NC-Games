const express = require("express");
const app = express();
app.use(express.json());
const {
  getCategories,
  getUsers,
  getReviews,
  getReviewById,
  patchVotes,
} = require("./controllers/controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors/errors");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchVotes);

app.get("/api/users", getUsers);

// ERROR HANDLING

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
