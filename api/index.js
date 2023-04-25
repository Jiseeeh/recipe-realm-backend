import express from "express";

import { pool } from "./services/database";
import user from "./routes/user";
import recipe from "./routes/recipe";

const app = express();

app.use(user);
app.use(recipe);

app.get("/api", async (req, res) => {
  const userInit = `CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);`;

  const recipeInit = `CREATE TABLE IF NOT EXISTS recipe (
  id INT AUTO_INCREMENT,
  private_id VARCHAR(255) NOT NULL,
  name VARCHAR(75) NOT NULL,
  author_id INT,
  author_name VARCHAR(50) NOT NULL,
  image_link VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(author_id) REFERENCES user(id)
);`;

  try {
    await pool.query(userInit);
    await pool.query(recipeInit);
    res.json({ message: "Successs!" });
  } catch (error) {
    res.json({ message: "Oh no something went wrong" });
  }
});

module.exports = app;
