import { pool } from "../services/database";

export async function createUser(req, res) {
  const { username } = req.body;

  try {
    const result = await pool.query("INSERT INTO user (name) VALUES (?)", [
      username,
    ]);

    res.status(201).json({ id: result[0].insertId, username, success: true });
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
}
