import { v4 } from "uuid";
import moment from "moment";

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

export async function likeRecipe(req, res, next) {
  const { recipeId, userId } = req.query;

  try {
    // check existing like between the user and the recipe
    const result = await sqlQuery(
      `SELECT next_increment FROM likes WHERE user_id = '${userId}' AND recipe_id = '${recipeId}'`
    );

    const nextAllowedIncrement = result[0]?.next_increment;

    const next_increment = moment().add(1, "d").format("YYYY-MM-DD hh:mm:ss");

    // means recipe currently has no likes
    if (!nextAllowedIncrement) {
      // create new  likes row
      await sqlQuery(
        `INSERT INTO likes (user_id,recipe_id,next_increment) VALUES('${userId}','${recipeId}','${next_increment}')`
      );

      // update likes count
      await sqlQuery(
        `UPDATE recipe SET likes_count = likes_count + 1 WHERE id = '${recipeId}'`
      );

      res.json({ message: "Successfully liked!", success: true });
      return;
    }

    // allow like if date.now is after the next allowed increment.
    if (moment().isAfter(moment(nextAllowedIncrement))) {
      // increment likes_count
      await sqlQuery(
        `UPDATE recipe SET likes_count = likes_count + 1 WHERE id = '${recipeId}'`
      );

      // update next allowed increment
      await sqlQuery(
        `UPDATE likes SET next_increment = '${next_increment}' WHERE user_id = '${userId}' AND recipe_id = '${recipeId}'`
      );

      res.json({ message: "Successfully liked!", success: true });
    } else {
      res.json({
        message: "You have already given your like for this recipe today.",
        success: false,
      });
    }
  } catch (error) {
    const err = new Error();
    err.cause = error;

    next(err);
  }
}

export async function getRecipeLikes(req, res, next) {
  const { recipeId, userId } = req.query;
  let likes_count = null;

  try {
    const result = await sqlQuery(
      `SELECT likes_count FROM recipe WHERE id = '${Number(recipeId)}'`
    );

    likes_count = result[0].likes_count;

    const getNextAllowedIncrementResult = await sqlQuery(
      `SELECT next_increment FROM likes WHERE recipe_id = '${recipeId}' AND user_id = '${userId}'`
    );
    const next_increment = getNextAllowedIncrementResult[0]?.next_increment;

    if (!next_increment) {
      const err = new Error();
      err.code = "NYL"; // not yet liked hehe
      throw err;
    }

    // send isLiked to determine if like button is filled or not
    if (moment().isAfter(moment(next_increment))) {
      res.json({ likes_count, isLiked: false });
    } else {
      res.json({ likes_count, isLiked: true });
    }
  } catch (error) {
    if (error.code === "NYL") {
      res.json({ likes_count });
      return;
    }

    const err = new Error();
    err.response = { message: "No recipe found with that ID.", success: false };
    err.cause = error;
    err.statusCode = 404;

    next(err);
  }
}

export async function dislikeRecipe(req, res, next) {
  const { recipeId, userId } = req.query;

  try {
    const result = await sqlQuery(
      `SELECT next_increment FROM likes WHERE recipe_id = '${recipeId}' AND user_id = '${userId}'`
    );

    const nextAllowedIncrement = result[0]?.next_increment;
    const now = moment().format("YYYY-MM-DD hh:mm:ss");

    // if haven't liked the recipe
    if (!nextAllowedIncrement) {
      await sqlQuery(
        `UPDATE recipe SET likes_count = likes_count - 1 WHERE id = '${recipeId}'`
      );

      await sqlQuery(
        `INSERT INTO likes (user_id,recipe_id,next_increment) VALUES('${userId}','${recipeId}','${now}')`
      );

      res.status(200).json({ message: "Successfully Disliked", success: true });
      return;
    }

    // only allow dislike if user liked the recipe.
    if (moment().isBefore(moment(nextAllowedIncrement))) {
      await sqlQuery(
        `UPDATE recipe SET likes_count = likes_count - 1 WHERE id = '${recipeId}'`
      );

      // update next allowed inc
      await sqlQuery(
        `UPDATE likes SET next_increment = '${now}' WHERE recipe_id = '${recipeId}' AND user_id = '${userId}'`
      );

      res.status(200).json({ message: "Successfully Disliked", success: true });
    } else {
      res.status(409).json({
        message: "You already disliked this recipe.",
        success: false,
      });
    }
  } catch (error) {
    const err = new Error();
    err.response = { message: "Server is down at the moment" };

    next(err);
  }
}
