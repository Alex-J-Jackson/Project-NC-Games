module.exports = [
  {
    Endpoint: "/api/categories",
    Method: "GET",
    Description: "returns an array of all categories",
  },
  {
    Endpoint: "/api/users",
    Method: "GET",
    Description: "returns an array of all users",
  },
  {
    Endpoint: "/api/reviews",
    Method: "GET",
    Description:
      "returns an array of all reviews. Takes queries of sort_by, order, category, limit and p.",
  },
  {
    Endpoint: "/api/reviews/:review_id",
    Method: "GET",
    Description: "returns the review with the specified ID",
  },
  {
    Endpoint: "/api/reviews/:review_id/comments",
    Method: "GET",
    Description: "returns the comments linked to the specified review",
  },
  {
    Endpoint: "/api/reviews/:review_id/comments",
    Method: "POST",
    Description:
      "adds a new comment to the database linked to the specified review (returns the added comment)",
  },
  {
    Endpoint: "/api/reviews",
    Method: "POST",
    Description:
      "adds a new review to the database: takes key-values of owner, title, review_body, designer and category.",
  },
  {
    Endpoint: "/api/reviews/:review_id",
    Method: "PATCH",
    Description:
      "adds or subtracts from the number of votes on the specified review",
  },
  {
    Endpoint: "/api/comments/:comment_id",
    Method: "DELETE",
    Description: "deletes the specified comment from the database",
  },
  {
    Endpoint: "/api/reviews/:review_id",
    Method: "DELETE",
    Description: "deletes the specified review from the database",
  },
];
