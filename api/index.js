import express from "express";
import dotenv from "dotenv";
import sql from "mssql";
import { v4 } from "uuid";

import { migrations } from "./services/migrations/migrations";
import { seeds } from "./services/seed/seed";
import { errorHandler, noRouteFoundHandler } from "./middleware/errorHandler";
import { sqlQuery } from "./services/database";
import user from "./routes/user";
import recipe from "./routes/recipe";
import admin from "./routes/admin";

const app = express();
dotenv.config();

app.use(user);
app.use(recipe);
app.use(admin);

app.get("/api", async (req, res) => {
  try {
    for (const migration of migrations) {
      await sqlQuery(migration);
    }

    res.json({ message: "Success!" });
  } catch (error) {
    res.json({
      message: "Oh no something went wrong",
      error: process.env.NODE_ENV === "development" ? error : "",
    });
  }
});

app.get("/api/seed", async (req, res, next) => {
  if (req.query.secret !== process.env.SECRET) {
    res.status(401).json({ message: "Unauthorized" });
  }

  try {
    for (const seed of seeds) {
      await sqlQuery(seed);
    }

    res.status(200).json({ message: "Seeding success!" });
  } catch (error) {
    // re throw
    const err = new Error();
    err.cause = error;
    next(err);
  }
});

// error handlers
app.use(errorHandler);
app.use(noRouteFoundHandler);

module.exports = app;
