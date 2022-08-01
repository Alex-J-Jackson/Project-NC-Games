const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers");

app.get("/api/categories", getCategories);

// ERROR HANDLING

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
