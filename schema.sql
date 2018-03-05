CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  passwd VARCHAR(255) NOT NULL,
  fname VARCHAR(255) NOT NULL,
  avatar TEXT
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    isbn13 VARCHAR(13) UNIQUE NOT NULL,
    author VARCHAR(64),
    description TEXT,
    category VARCHAR(255) UNIQUE NOT NULL,
    isbn10 VARCHAR(10) UNIQUE,
    published DATE,
    pagecount INT,
    language VARCHAR(2),
    FOREIGN KEY (category) REFERENCES categories (category)
);

CREATE TABLE readBooks (
    id SERIAL PRIMARY KEY,
    userID INT NOT NULL,
    bookID INT NOT NULL,
    rating INT NOT NULL,
    review TEXT,
    FOREIGN KEY (userID) REFERENCES users (id),
    FOREIGN KEY (bookID) REFERENCES books (id)
);