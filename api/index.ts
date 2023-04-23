import express, { Express, Request, Response } from "express";

import { init } from "./services/database";
import user from "./routes/user";
import recipe from "./routes/recipe";

const app: Express = express();

app.use(init);
app.use(user);
app.use(recipe);

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "welcome" });
});

module.exports = app;
