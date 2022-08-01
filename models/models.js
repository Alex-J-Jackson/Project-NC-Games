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
      return Promise.reject(err);
    });
};
