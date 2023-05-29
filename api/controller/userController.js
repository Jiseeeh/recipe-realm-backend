import { pool } from "../services/database";

export async function createUser(req, res, next) {
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
    if (error.code === "ER_DUP_ENTRY") {
      const err = new Error();
      err.response = { message: "Name is already taken." };
      err.statusCode = 409;

      next(err);
    } else {
      const err = new Error();
      err.response = { message: "Server is down at the moment." };

      next(err);
    }
  }
}

export async function checkUser(req, res, next) {
  const { username, password } = req.query;

  const err = new Error();

  try {
    const result = await pool.query(
      "SELECT id,name,is_admin FROM user WHERE name=? AND password=?",
      [username, password]
    );

    // has match
    if (result[0].length >= 1)
      res.status(200).json({
        message: "Login Success!",
        result: result[0][0],
        success: true,
      });
    else {
      err.response = { message: "Login Failed" };
      err.statusCode = 404;

      next(err);
    }
  } catch (error) {
    // re throw
    const err = new Error();
    err.response = { message: "Server is down at the moment." };

    next(err);
  }
}
