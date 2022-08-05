const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getReviewComments,
  postReviewComment,
  patchVotes,
} = require("../controllers/controllers");

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchVotes);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewComments)
  .post(postReviewComment);

module.exports = reviewsRouter;
