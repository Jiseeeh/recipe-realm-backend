import { v4 } from "uuid";

import { pool } from "../services/database";

export async function createRecipe(req, res, next) {
  const {
    recipeName,
    authorId,
    authorName,
    imageLink,
    recipeIngredients,
    recipeDescription,
  } = req.query;

  try {
    const uuid = v4();

    await pool.query(
      `
    INSERT INTO recipe (private_id,name,author_id,author_name,image_link,description,ingredients) VALUES(?,?,?,?,?,?,?)`,
      [
        uuid,
        recipeName,
        authorId,
        authorName,
        imageLink,
        recipeDescription,
        recipeIngredients,
      ]
    );

    res.status(201).json({ uuid, success: true });
  } catch (error) {
    // re throw
    const err = new Error();
    err.response = { message: "Something went wrong", clearCache: true };

    next(err);
  }
}

export async function getRecipes(req, res, next) {
  const result = await pool.query(
    "SELECT * FROM recipe WHERE is_pending = FALSE"
  );

  const recipes = result[0];

  if (recipes.length >= 1) {
    res.status(200).json(recipes);
  } else {
    const err = new Error();
    err.response = { message: "No recipes found!" };
    err.statusCode = 404;

    next(err);
  }
}

export async function getRecipesByUser(req, res, next) {
  const { id, username: name } = req.params;

  const result = await pool.query(
    "SELECT * FROM recipe WHERE author_id=? AND author_name=?",
    [id, name]
  );

  const recipes = result[0];

  if (recipes.length >= 1) {
    res.status(200).json(recipes);
  } else {
    const err = new Error();
    err.response = { message: "No recipes found!" };
    err.statusCode = 404;

    next(err);
  }
}

export async function getRecipe(req, res, next) {
  const { id } = req.params;

  const result = await pool.query("SELECT * FROM recipe WHERE id=?", [id]);

  if (result[0].length === 1) {
    res.status(200).json(result[0][0]);
  } else {
    const err = new Error();
    err.response = { message: "No recipe found with that ID" };
    err.statusCode = 404;

    next(err);
  }
}

export async function deleteRecipe(req, res, next) {
  const { id: private_id } = req.params;

  try {
    await pool.query("DELETE FROM recipe WHERE private_id=?", [private_id]);

    res.status(200).json({ message: "Deleted successfully", success: true });
  } catch {
    next(new Error());
  }
}

export async function updateRecipe(req, res, next) {
  const { id } = req.params;
  const { recipeName, imageLink, recipeIngredients, recipeDescription } =
    req.query;

  try {
    const result = await pool.query(
      "UPDATE recipe SET name=?,image_link=?,ingredients=?,description=? WHERE id=?",
      [recipeName, imageLink, recipeIngredients, recipeDescription, id]
    );

    res.status(200).json({ message: "Update success", success: true });
  } catch (error) {
    next(new Error());
  }
}
