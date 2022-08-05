const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
app.use(express.json());
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors/errors");

app.use("/api", apiRouter);

// ERROR HANDLING

app.all("/*", (_, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
