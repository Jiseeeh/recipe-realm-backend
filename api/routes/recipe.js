import express from "express";

import {
  createRecipe,
  getRecipes,
  getRecipesByUser,
  getRecipe,
  deleteRecipe,
  updateRecipe,
} from "../controller/recipeController";

const app = express();

app.route("/api/recipe").get(getRecipes).post(createRecipe);
app
  .route("/api/recipe/:id")
  .get(getRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);

app.route("/api/recipe/:id/:username").get(getRecipesByUser);

module.exports = app;
