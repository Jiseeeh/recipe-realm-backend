import express from "express";

import {
  createRecipe,
  getRecipes,
  getRecipe,
  deleteRecipe,
} from "../controller/recipeController";

const app = express();

app.route("/api/recipe").get(getRecipes).post(createRecipe);
app.route("/api/recipe/:id").get(getRecipe).delete(deleteRecipe);

module.exports = app;
