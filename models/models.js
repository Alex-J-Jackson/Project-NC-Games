const db = require("../db/connection");
const checkExists = require("../utils/check-exists");

// GET

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
      FROM reviews 
      LEFT JOIN comments ON reviews.review_id=comments.review_id
      GROUP BY reviews.review_id
      ORDER BY created_at DESC;`
    )
    .then(({ rows: reviews }) => {
      return reviews;
    });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
      FROM reviews 
      JOIN comments ON reviews.review_id=comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then(({ rows: review }) => {
      if (!review.length) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else {
        return review[0];
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.selectReviewComments = (review_id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
    .then(({ rows: comments }) => {
      if (!comments.length) {
        return checkExists("reviews", "review_id", review_id);
      } else {
        return comments;
      }
    })
    .catch((err) => {
      throw err;
    });
};

// PATCH

exports.updateVotes = (review_id, voteShift) => {
  const { inc_votes } = voteShift;
  return db
    .query(
      `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
      [review_id, inc_votes]
    )
    .then(({ rows: review }) => {
      if (!review.length) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
      // if (review[0].votes < 0) {
      //   const votes = review[0].votes - inc_votes;
      //   return Promise.reject({
      //     status: 400,
      //     msg: `No. of votes cannot be negative: current vote count is: ${votes}`,
      //   });
      // }
      return review[0];
    })
    .catch((err) => {
      throw err;
    });
};
