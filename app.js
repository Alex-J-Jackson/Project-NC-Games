const express = require("express");
const app = express();
app.use(express.json());
const {
  getCategories,
  getUsers,
  getReviews,
  getReviewById,
  getReviewComments,
  postReviewComment,
  deleteComment,
  patchVotes,
} = require("./controllers/controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors/errors");

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getReviewComments);
app.post("/api/reviews/:review_id/comments", postReviewComment);
app.patch("/api/reviews/:review_id", patchVotes);

app.delete("/api/comments/:comment_id", deleteComment);

// ERROR HANDLING

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
