const { ParameterDescriptionMessage } = require("pg-protocol/dist/messages");
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

exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
  const validSorts = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["asc", "desc"];
  const categoryValue = [];
  let queryStr = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
                  FROM reviews LEFT JOIN comments ON reviews.review_id=comments.review_id `;
  if (category) {
    queryStr += `WHERE category = $1 `;
    categoryValue.push(category);
  }
  queryStr += `GROUP BY reviews.review_id `;
  if (validSorts.includes(sort_by) && validOrders.includes(order)) {
    queryStr += `ORDER BY ${sort_by} ${order};`;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  return db.query(queryStr, categoryValue).then(({ rows: reviews }) => {
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

// POST

exports.addReviewComment = (review_id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (body, review_id, author)
     VALUES ($1, $2, $3) RETURNING *;`,
      [body, review_id, username]
    )
    .then(({ rows: comment }) => {
      return comment[0];
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

// DELETE

exports.removeComment = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id).then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [
      comment_id,
    ]);
  });
};
