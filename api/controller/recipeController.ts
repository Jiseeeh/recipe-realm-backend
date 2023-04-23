import { Request, Response } from "express";
import { v4 } from "uuid";

import { pool } from "../services/database";

export async function createRecipe(req: Request, res: Response) {
  const {
    recipeName,
    authorName,
    imageLink,
    recipeIngredients,
    recipeDescription,
  } = req.body;

  const result = await pool.query(
    `
  INSERT INTO recipe (private_id,name,author_name,image_link,description,ingredients) VALUES(?,?,?,?,?,?)`,
    [
      v4(),
      recipeName,
      authorName,
      imageLink,
      recipeDescription,
      recipeIngredients,
    ]
  );

  res.json(result);
}

// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
// export function createRecipe (req:Request,res:Response) {}
