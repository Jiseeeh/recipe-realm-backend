import express from "express";

import { pool } from "./services/database";
import { migrations } from "./services/migrations/migrations";
import user from "./routes/user";
import recipe from "./routes/recipe";
import admin from "./routes/admin";

const app = express();

app.use(user);
app.use(recipe);
app.use(admin);

app.get("/api", async (req, res) => {
  try {
    for (const migration of migrations) {
      await pool.query(migration);
    }

    res.json({ message: "Success!" });
  } catch (error) {
    res.json({ message: "Oh no something went wrong", error });
  }
});

module.exports = app;
