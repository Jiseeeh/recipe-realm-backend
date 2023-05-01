import { pool } from "../services/database";

export async function approveRecipe(req, res) {
  const { id } = req.params;

  try {
    await pool.query("UPDATE recipe SET is_pending = FALSE WHERE id=?", [id]);

    res.status(200).json({ message: "Approved!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
}

export async function disapproveRecipe(req, res) {
  const { id } = req.params;

  try {
    await pool.query("UPDATE recipe SET is_pending = TRUE WHERE id=?", [id]);

    res.status(200).json({ message: "Success!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
}

export async function deleteRecipe(req, res) {
  const { id } = req.params;

  const result = await pool.query("DELETE FROM recipe WHERE id=?", [id]);

  if (result[0].affectedRows === 1)
    res.status(200).json({ message: "Delete success!", success: true });
  else
    res
      .status(404)
      .json({ message: "No recipe found with that id", success: false });
}

export async function bulkApprove(req, res) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    for (const id of ids) {
      await pool.query("UPDATE recipe SET is_pending = FALSE WHERE id=?", [id]);
    }

    res.status(200).json({ message: "Approved!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
}

export async function bulkDisapprove(req, res) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    for (const id of ids) {
      await pool.query("UPDATE recipe SET is_pending = TRUE WHERE id=?", [id]);
    }

    res.status(200).json({ message: "Success!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
}

export async function bulkDelete(req, res) {
  let { ids } = req.query;

  ids = JSON.parse(ids);

  try {
    for (const id of ids) {
      await pool.query("DELETE FROM recipe WHERE id=?", [id]);
    }

    res.status(200).json({ message: "Delete success!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
}
