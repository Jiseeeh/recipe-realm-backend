import express from "express";

import {
  createRecipe,
  getRecipes,
  getRecipesByUser,
  getRecipe,
  deleteRecipe,
  updateRecipe,
  likeRecipe,
  getRecipeLikes,
  dislikeRecipe,
} from "../controller/recipeController";

const app = express();

app.route("/api/recipe").get(getRecipes).post(createRecipe);
app
  .route("/api/recipe/:id")
  .get(getRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);

app.route("/api/recipe/:id/:username").get(getRecipesByUser);

// recipe likes
app
  .route("/api/recipe-likes")
  .get(getRecipeLikes)
  .post(likeRecipe)
  .patch(dislikeRecipe);

module.exports = app;
