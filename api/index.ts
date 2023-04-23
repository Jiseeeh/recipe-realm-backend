import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "welcome" });
});

module.exports = app;
