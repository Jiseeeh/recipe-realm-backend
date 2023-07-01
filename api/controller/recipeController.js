import { v4 } from "uuid";

import { sqlQuery } from "../services/database";
import preserve from "../helper/preserve";

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

    await sqlQuery(
      `INSERT INTO recipe (private_id,name,author_id,author_name,image_link,description,ingredients) VALUES ('${uuid}','${recipeName}',${authorId},'${authorName}','${imageLink}','${preserve.encodeNewLineAndQuote(
        recipeDescription
      )}','${preserve.encodeNewLineAndQuote(recipeIngredients)}')`
    );

    res.status(201).json({ uuid, success: true });
  } catch (error) {
    // re throw
    const err = new Error();
    err.response = { message: "Something went wrong", clearCache: true };
    err.cause = error;

    next(err);
  }
}

export async function getRecipes(req, res, next) {
  try {
    const result = await sqlQuery("SELECT * FROM recipe WHERE is_pending = 0");

    if (result.length >= 1) {
      const recipes = result.map((recipe) => ({
        ...recipe,
        description: preserve.decodeNewLineAndQuote(recipe.description),
        ingredients: preserve.decodeNewLineAndQuote(recipe.ingredients),
      }));

      res.status(200).json(recipes);
    } else {
      const err = new Error();
      err.response = { message: "No recipes found!" };
      err.statusCode = 404;

      next(err);
    }
  } catch (error) {
    const err = new Error();
    err.response = {
      message: "Server is down at the moment.",
      clearCache: true,
    };

    next(err);
  }
}

export async function getRecipesByUser(req, res, next) {
  const { id, username: name } = req.params;

  try {
    const result = await sqlQuery(
      `SELECT * FROM recipe WHERE author_id=${id} AND author_name='${name}'`
    );

    if (result.length >= 1) {
      const recipes = result.map((recipe) => ({
        ...recipe,
        description: preserve.decodeNewLineAndQuote(recipe.description),
        ingredients: preserve.decodeNewLineAndQuote(recipe.ingredients),
      }));

      res.status(200).json(recipes);
    } else {
      const err = new Error();
      err.response = { message: "No recipes found!" };
      err.statusCode = 404;

      next(err);
    }
  } catch {
    const err = new Error();
    err.response = {
      message: "Server is down at the moment.",
      clearCache: true,
    };

    next(err);
  }
}

export async function getRecipe(req, res, next) {
  const { id } = req.params;

  const result = await sqlQuery(`SELECT * FROM recipe WHERE id=${id}`);

  if (result.length === 1) {
    const recipe = {
      ...result[0],
      description: preserve.decodeNewLineAndQuote(result[0].description),
      ingredients: preserve.decodeNewLineAndQuote(result[0].ingredients),
    };

    res.status(200).json(recipe);
  } else {
    const err = new Error();
    err.response = { message: "No recipe found with that ID" };
    err.statusCode = 404;

    next(err);
  }
}

export async function deleteRecipe(req, res, next) {
  const { id: private_id } = req.params;

  const result = await sqlQuery(
    `DELETE FROM recipe WHERE private_id='${private_id}'`,
    true
  );

  if (result.rowsAffected[0] === 0) {
    const err = new Error();
    err.response = { message: "No recipe was found with that id." };
    err.statusCode = 400;
    next(err);
    return;
  }

  res.status(200).json({ message: "Deleted successfully", success: true });
}

export async function updateRecipe(req, res, next) {
  const { id } = req.params;
  const { recipeName, imageLink, recipeIngredients, recipeDescription } =
    req.query;

  const result = await sqlQuery(
    `UPDATE recipe SET name='${recipeName}',image_link='${imageLink}',ingredients='${preserve.encodeNewLineAndQuote(
      recipeIngredients
    )}',description='${preserve.encodeNewLineAndQuote(
      recipeDescription
    )}' WHERE id=${id}`,
    true
  );

  if (result.rowsAffected[0] === 0) {
    const err = new Error();
    err.response = { message: "No recipe was found with that id." };
    err.statusCode = 400;
    next(err);
    return;
  }

  res.status(200).json({ message: "Update success", success: true, result });
}
