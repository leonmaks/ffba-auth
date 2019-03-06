INSERT INTO
  ffba_auth_user
  (username, email, password)
VALUES
  (${username}, ${email}, ${password})
RETURNING
  *
