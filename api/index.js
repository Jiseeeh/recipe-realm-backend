import express from "express";

import { init } from "./services/database";
import user from "./routes/user";
import recipe from "./routes/recipe";

const app = express();

app.use(user);
app.use(recipe);

app.get("/api", async (req, res) => {
  try {
    init();
    res.json({ message: "Successs!" });
  } catch (error) {
    res.json({ message: "Oh no something went wrong" });
  }
});

module.exports = app;
