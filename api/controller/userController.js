import bcrypt from "bcrypt";

import { pool } from "../services/database";

export async function createUser(req, res, next) {
  const { username, password } = req.query;

  bcrypt.hash(password, Number(process.env.SALT_ROUNDS), async (err, hash) => {
    if (err) {
      next(new Error());
      return;
    }

    try {
      const result = await pool.query(
        "INSERT INTO user (name,password) VALUES (?,?)",
        [username, hash]
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
  });
}

export async function checkUser(req, res, next) {
  const { username, password } = req.query;

  try {
    const result = await pool.query("SELECT * FROM user WHERE name=?", [
      username,
    ]);

    const user = result[0][0];

    if (!user) {
      const err = new Error();
      err.response = { message: "No user found.", success: false };
      err.statusCode = 404;
      next(err);
      return;
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        next(new Error());
        return;
      }

      if (!result) {
        const err = new Error();
        err.response = {
          message: "Invalid Credentials.",
          success: false,
          password,
        };
        err.statusCode = 401;
        next(err);
        return;
      }

      res.status(200).json({
        message: "Login Success",
        result: {
          id: user.id,
          name: user.name,
          is_admin: user.is_admin,
        },
      });
    });
  } catch (error) {
    console.log({ error });
    // re throw
    const err = new Error();
    err.response = { message: "Server is down at the moment." };

    next(err);
  }
}
