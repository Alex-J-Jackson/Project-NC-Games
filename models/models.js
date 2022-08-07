const db = require("../db/connection");
const checkExists = require("../utils/check-exists");
const { validSorts, validOrders } = require("./valid-sorts-valid-orders");

// GET

exports.selectEndpoints = () => {
  return db.query(`SELECT * FROM endpoints;`).then(({ rows: endpoints }) => {
    return endpoints;
  });
};

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

exports.selectUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows: user }) => {
      if (!user.length) {
        return Promise.reject({ status: 404, msg: "Username not found" });
      } else {
        return user[0];
      }
    });
};

exports.selectReviews = (
  sort_by = "created_at",
  order = "desc",
  category,
  limit = 10,
  p = 1
) => {
  const categoryValue = [];
  let queryStr = "";
  queryStr += `SELECT reviews.*, COUNT(*) OVER() :: INT AS total_count, COUNT(comments.comment_id) :: INT AS comment_count FROM reviews 
               LEFT JOIN comments ON reviews.review_id=comments.review_id `;
  if (category) {
    queryStr += `WHERE category = $1 `;
    categoryValue.push(category);
  }
  queryStr += `GROUP BY reviews.review_id `;
  if (validSorts.includes(sort_by) && validOrders.includes(order)) {
    queryStr += `ORDER BY ${sort_by} ${order} `;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  if (/[^a-z]/i.test(limit) && /[^a-z]/i.test(p)) {
    queryStr += `LIMIT ${limit} OFFSET ${(p - 1) * limit};`;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid limit or page query" });
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

exports.addReview = (review) => {
  const { owner, title, review_body, designer, category } = review;
  return db
    .query(
      `INSERT INTO reviews 
      (owner, title, review_body, designer, category) 
      VALUES 
      ($1, $2, $3, $4, $5) 
      RETURNING *;`,
      [owner, title, review_body, designer, category]
    )
    .then(({ rows: review }) => {
      review[0].comment_count = 0;
      return review[0];
    })
    .catch((err) => {
      throw err;
    });
};

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

exports.updateReviewVotes = (review_id, voteShift) => {
  const { inc_votes } = voteShift;
  return db
    .query(
      `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
      [review_id, inc_votes]
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

exports.updateCommentVotes = (comment_id, voteShift) => {
  const { inc_votes } = voteShift;
  return db
    .query(
      `UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;`,
      [comment_id, inc_votes]
    )
    .then(({ rows: comment }) => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else {
        return comment[0];
      }
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
