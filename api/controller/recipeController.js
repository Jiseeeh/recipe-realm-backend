import { v4 } from "uuid";
import moment from "moment";

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
  try {
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
  } catch {
    // re throw
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
  } catch {
    // re throw
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

/**
 * The `likeRecipe` function allows a user to like a recipe, updating the likes count and checking if
 * the user has already liked the recipe within a 24-hour period.
 */
export async function likeRecipe(req, res, next) {
  const { recipeId, userId } = req.query;

  try {
    // check existing like between the user and the recipe
    const result = await pool.query(
      "SELECT next_increment FROM likes WHERE user_id = ? AND recipe_id = ?",
      [userId, recipeId]
    );
    const nextAllowedIncrement = result[0][0]?.next_increment;

    const next_increment = moment().add(1, "d").format("YYYY-MM-DD hh:mm:ss");

    // means recipe currently has no likes
    if (!nextAllowedIncrement) {
      // create new  likes row
      await pool.query(
        "INSERT INTO likes (user_id,recipe_id,next_increment) VALUES(?,?,?)",
        [userId, recipeId, next_increment]
      );

      // update likes count
      await pool.query(
        "UPDATE recipe SET likes_count = likes_count + 1 WHERE id = ?",
        [recipeId]
      );

      res.json({ message: "Successfully liked!", success: true });
      return;
    }

    // allow like if date.now is after the next allowed increment.
    if (moment().isAfter(moment(nextAllowedIncrement))) {
      // increment likes_count
      await pool.query(
        "UPDATE recipe SET likes_count = likes_count + 1 WHERE id = ?",
        [recipeId]
      );

      // update next allowed increment
      await pool.query(
        "UPDATE likes SET next_increment = ? WHERE user_id = ? AND recipe_id = ?",
        [next_increment, userId, recipeId]
      );

      res.json({ message: "Successfully liked!", success: true });
    } else {
      res.json({
        message: "You have already given your like for this day.",
        success: false,
      });
    }
  } catch {
    next(new Error());
  }
}

export async function getRecipeLikes(req, res, next) {
  const { recipeId, userId } = req.query;
  let likes_count = null;

  try {
    const result = await pool.query(
      "SELECT likes_count FROM recipe WHERE id = ?",
      [Number(recipeId)]
    );

    likes_count = result[0][0].likes_count;

    const getNextAllowedIncrementResult = await pool.query(
      "SELECT next_increment FROM likes WHERE recipe_id = ? AND user_id = ?",
      [recipeId, userId]
    );
    const next_increment = getNextAllowedIncrementResult[0][0]?.next_increment;

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
    err.statusCode = 404;

    next(err);
  }
}
