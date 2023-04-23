import { Request, Response } from "express";

import { pool } from "../services/database";

export async function createUser(req: Request, res: Response) {
  const { username } = req.body;

  const result = await pool.query("INSERT INTO user (name) VALUES (?)", [
    username,
  ]);

  res.status(201).json(result);
}
