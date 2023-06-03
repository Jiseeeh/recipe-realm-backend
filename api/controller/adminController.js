import { sqlQuery } from "../services/database";

export async function getRecipes(req, res, next) {
  const { id, username: name } = req.query;

  // check if user is really an admin
  const user = await sqlQuery(
    `SELECT is_admin FROM users WHERE id=${id} AND name='${name}'`
  );

  const result = user[0];

  if (!result) {
    const err = new Error();

    err.response = { message: "Invalid Request", clearCache: true };
    err.statusCode = 404;

    next(err);
    return;
  }

  const isAdmin = result.is_admin;

  if (!isAdmin) {
    const err = new Error();

    err.response = {
      message: "You are not allowed to access this resource",
    };
    err.statusCode = 403;

    next(err);
    return;
  }

  const recipes = await sqlQuery("SELECT * FROM recipe");
  const err = new Error();

  if (recipes.length >= 1) {
    res.status(200).json(recipes);
  } else {
    err.response = { message: "No recipes found!" };
    err.statusCode = 404;

    next(err);
  }
}

export async function approveRecipe(req, res, next) {
  const { id } = req.params;

  const result = await sqlQuery(
    `UPDATE recipe SET is_pending = 0 WHERE id=${id}`,
    true
  );

  if (result.rowsAffected[0] === 0) {
    const err = new Error();
    err.response = { message: "No recipe was found with that id." };
    err.statusCode = 400;
    next(err);
    return;
  }

  res.status(200).json({ message: "Approved!", success: true });
}

export async function disapproveRecipe(req, res, next) {
  const { id } = req.params;

  const result = await sqlQuery(
    `UPDATE recipe SET is_pending = 1 WHERE id=${id}`,
    true
  );

  if (result.rowsAffected[0] === 0) {
    const err = new Error();
    err.response = { message: "No recipe was found with that id." };
    err.statusCode = 400;
    next(err);
    return;
  }

  res.status(200).json({ message: "Success!", success: true });
}

export async function deleteRecipe(req, res, next) {
  const { id } = req.params;

  const result = await sqlQuery(`DELETE FROM recipe WHERE id=${id}`, true);

  if (result.rowsAffected[0] === 0) {
    const err = new Error();
    err.response = { message: "No recipe was found with that id." };
    err.statusCode = 400;
    next(err);
    return;
  }

  res.status(200).json({ message: "Delete success!", success: true });
}

export async function bulkApprove(req, res, next) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    const success = [];
    const failed = [];

    for (const id of ids) {
      const result = await sqlQuery(
        `UPDATE recipe SET is_pending = 0 WHERE id=${id}`,
        true
      );

      if (result.rowsAffected[0] === 1) success.push(id);
      else failed.push(id);
    }

    res.status(200).json({
      message: "Approved!",
      success: true,
      succeed: success.length,
      failed: failed.length,
    });
  } catch {
    // re throw
    next(new Error());
  }
}

export async function bulkDisapprove(req, res, next) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    const success = [];
    const failed = [];

    for (const id of ids) {
      const result = await sqlQuery(
        `UPDATE recipe SET is_pending = 1 WHERE id=${id}`,
        true
      );

      if (result.rowsAffected[0] === 1) success.push(id);
      else failed.push(id);
    }

    res.status(200).json({
      message: "Success!",
      success: true,
      succeed: success.length,
      failed: failed.length,
    });
  } catch {
    // re throw
    next(new Error());
  }
}

export async function bulkDelete(req, res, next) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    const success = [];
    const failed = [];

    for (const id of ids) {
      const result = await sqlQuery(`DELETE FROM recipe WHERE id=${id}`, true);

      if (result.rowsAffected[0] === 1) success.push(id);
      else failed.push(id);
    }

    res.status(200).json({
      message: "Delete success!",
      success: true,
      succeed: success.length,
      failed: failed.length,
    });
  } catch {
    // re throw
    next(new Error());
  }
}
