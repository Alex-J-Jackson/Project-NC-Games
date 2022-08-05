const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getReviewComments,
  postReviewComment,
  patchReviewVotes,
} = require("../controllers/controllers");

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewVotes);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewComments)
  .post(postReviewComment);

module.exports = reviewsRouter;
