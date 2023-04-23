import { Request, Response } from "express";
import { v4 } from "uuid";

import { pool } from "../services/database";

export async function createRecipe(req: Request, res: Response) {
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

export async function getRecipes(req: Request, res: Response) {
  const result = await pool.query("SELECT * FROM recipe");

  res.json(result[0]);
}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
