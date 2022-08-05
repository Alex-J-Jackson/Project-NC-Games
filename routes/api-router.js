const apiRouter = require("express").Router();
const categoriesRouter = require("./categories-router");
const usersRouter = require("./users-router");
const reviewsRouter = require("./reviews-router");
const commentsRouter = require("./comments-router");
const { getEndpoints } = require("../controllers/controllers");

apiRouter.get("/", getEndpoints);

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
