DROP TABLE IF EXISTS github_users;
DROP TABLE IF EXISTS posts;

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  avatar TEXT
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (content) VALUES
('jeans isn''nt a letter, jeans is pants!'),
('can i get an alcohol?'),
('ma called! the bees are back!');
