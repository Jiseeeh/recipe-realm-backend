import { pool } from "../services/database";

export async function getRecipes(req, res, next) {
  // check if user is really an admin
  const { id, username: name } = req.query;

  const user = await pool.query(
    "SELECT is_admin FROM user WHERE id=? AND name=?",
    [id, name]
  );

  const result = user[0];

  if (result.length === 0) {
    const err = new Error();

    err.response = { message: "Invalid Request", clearCache: true };
    err.statusCode = 404;

    next(err);
  }

  const isAdmin = !!user[0][0].is_admin;

  if (!isAdmin) {
    const err = new Error();

    err.response = {
      message: "You are not allowed to access this resource",
      clearCache: true,
    };
    err.statusCode = 403;

    next(err);
  } else {
    const result = await pool.query("SELECT * FROM recipe");
    const recipes = result[0];
    const err = new Error();

    if (recipes.length >= 1) {
      res.status(200).json(recipes);
    } else {
      err.response = { message: "No recipes found!" };
      err.statusCode = 404;

      next(err);
    }
  }
}

export async function approveRecipe(req, res, next) {
  const { id } = req.params;

  try {
    await pool.query("UPDATE recipe SET is_pending = FALSE WHERE id=?", [id]);

    res.status(200).json({ message: "Approved!", success: true });
  } catch {
    // re throw
    next(new Error());
  }
}

export async function disapproveRecipe(req, res, next) {
  const { id } = req.params;

  try {
    await pool.query("UPDATE recipe SET is_pending = TRUE WHERE id=?", [id]);

    res.status(200).json({ message: "Success!", success: true });
  } catch {
    // re throw
    next(new Error());
  }
}

export async function deleteRecipe(req, res, next) {
  const { id } = req.params;

  const result = await pool.query("DELETE FROM recipe WHERE id=?", [id]);

  if (result[0].affectedRows === 1)
    res.status(200).json({ message: "Delete success!", success: true });
  else {
    const err = new Error();
    err.response = { message: "No recipe found with that id" };
    err.statusCode = 404;

    next(err);
  }
}

export async function bulkApprove(req, res, next) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    for (const id of ids) {
      await pool.query("UPDATE recipe SET is_pending = FALSE WHERE id=?", [id]);
    }

    res.status(200).json({ message: "Approved!", success: true });
  } catch {
    // re throw
    next(new Error());
  }
}

export async function bulkDisapprove(req, res, next) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    for (const id of ids) {
      await pool.query("UPDATE recipe SET is_pending = TRUE WHERE id=?", [id]);
    }

    res.status(200).json({ message: "Success!", success: true });
  } catch {
    // re throw
    next(new Error());
  }
}

export async function bulkDelete(req, res, next) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    for (const id of ids) {
      await pool.query("DELETE FROM recipe WHERE id=?", [id]);
    }

    res.status(200).json({ message: "Delete success!", success: true });
  } catch {
    // re throw
    next(new Error());
  }
}
