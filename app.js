const express = require("express");
const app = express();
const { getCategories, getReviewById } = require("./controllers/controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors/errors");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

// ERROR HANDLING

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
