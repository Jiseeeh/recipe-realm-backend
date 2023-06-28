export const migrations = [
  `CREATE TABLE IF NOT EXISTS user (
      id INT AUTO_INCREMENT,
      name VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(50) NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      PRIMARY KEY(id)
  );`,
  `CREATE TABLE IF NOT EXISTS recipe(
    id INT AUTO_INCREMENT,
    private_id VARCHAR(255) NOT NULL,
    name VARCHAR(75) NOT NULL,
    author_id INT,
    author_name VARCHAR(50) NOT NULL,
    is_pending BOOLEAN NOT NULL DEFAULT TRUE,
    image_link VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(author_id) REFERENCES user(id)
  );`,
  `CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    next_increment DATETIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(recipe_id) REFERENCES recipe(id)
);`,
  `ALTER TABLE recipe ADD likes_count INT NOT NULL DEFAULT 0`,
];
