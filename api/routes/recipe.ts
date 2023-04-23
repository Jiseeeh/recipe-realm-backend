import express, { Express } from "express";

import { createRecipe } from "../controller/recipeController";

const app: Express = express();

app.route("/api/recipe").post(createRecipe);

export default app;
