const db = require("../db/connection");

exports.selectCategories = () => {
  return db
    .query(`SELECT * FROM categories;`)
    .then(({ rows: categories }) => {
      return categories;
    })
    .catch((err) => {
      return err;
    });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
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
