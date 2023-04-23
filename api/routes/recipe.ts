import express, { Express } from "express";

import { createRecipe, getRecipes } from "../controller/recipeController";

const app: Express = express();

app.route("/api/recipe").get(getRecipes).post(createRecipe);

export default app;
