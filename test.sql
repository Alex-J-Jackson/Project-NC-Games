\c nc_games_test

UPDATE comments SET votes = votes + 5 WHERE comment_id = 1 RETURNING *;