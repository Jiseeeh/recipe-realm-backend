import { pool } from "../services/database";

export async function createUser(req, res) {
  const { username, password } = req.query;

  try {
    const result = await pool.query(
      "INSERT INTO user (name,password) VALUES (?,?)",
      [username, password]
    );

    res.status(200).json({
      message: "Sign up success!",
      id: result[0].insertId,
      username,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Name is already taken.", success: false });
  }
}

export async function checkUser(req, res) {
  const { username, password } = req.query;

  const result = await pool.query(
    "SELECT id,name FROM user WHERE name=? AND password=?",
    [username, password]
  );

  // has match
  if (result[0].length >= 1)
    res.status(200).json({ message: "Login Success!", success: true });
  else res.status(404).json({ message: "Login Failed", success: false });
}
