import express, { Express, Request, Response } from "express";

import { init } from "./services/database";

const app: Express = express();

app.use(init);

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "welcome" });
});

module.exports = app;
