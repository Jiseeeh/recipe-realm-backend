export const migrations = [
  `CREATE TABLE users(
    id INT IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BIT NOT NULL DEFAULT 0,
    PRIMARY KEY(id)
);`,
  `CREATE TABLE recipe (
    id INT IDENTITY,
    private_id VARCHAR(255) NOT NULL,
    name VARCHAR(75) NOT NULL,
    author_id INT,
    author_name VARCHAR(50) NOT NULL,
    is_pending BIT NOT NULL DEFAULT 1,
    image_link VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(author_id) REFERENCES users(id)
  );`,
];
