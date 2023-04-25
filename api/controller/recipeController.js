import { v4 } from "uuid";

import { pool } from "../services/database";

export async function createRecipe(req, res) {
  const {
    recipeName,
    authorId,
    authorName,
    imageLink,
    recipeIngredients,
    recipeDescription,
  } = req.body;

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
    res.status(500).json({ error, success: false });
  }
}

export async function getRecipes(req, res) {
  try {
    const result = await pool.query("SELECT * FROM recipe");

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getRecipe(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM recipe WHERE id=?", [id]);

    res.status(200).json(result[0][0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
}

export async function deleteRecipe(req, res) {
  const { id: private_id } = req.params;

  try {
    await pool.query("DELETE FROM recipe WHERE private_id=?", [private_id]);

    res.status(200).json({ message: "Deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", success: false });
  }
}
