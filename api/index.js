import express from "express";

import { init } from "./services/database";
import user from "./routes/user";
import recipe from "./routes/recipe";

const app = express();

app.use(init);
app.use(user);
app.use(recipe);

app.get("/api", (req, res) => {
  res.json({ message: "welcome" });
});

module.exports = app;
