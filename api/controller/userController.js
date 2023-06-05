import bcrypt from "bcrypt";

import { sqlQuery } from "../services/database";

export async function createUser(req, res, next) {
  const { username, password } = req.query;

  bcrypt.hash(password, Number(process.env.SALT_ROUNDS), async (err, hash) => {
    if (err) {
      next(new Error());
      return;
    }

    try {
      await sqlQuery(
        `INSERT INTO users (name,password) VALUES ('${username}','${hash}')`
      );

      res.status(200).json({
        message: "Sign up success!",
        // username,
        success: true,
      });
    } catch (error) {
      if (error.code === "EREQUEST") {
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
    // get user
    const result = await sqlQuery(
      `SELECT * FROM users WHERE name = '${username}'`
    );
    const user = result[0];

    if (!user) {
      const err = new Error();
      err.response = { message: "User was not found." };
      err.statusCode = 404;
      next(err);
      return;
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        next(err);
        return;
      }

      if (!result) {
        const err = new Error();
        err.response = { message: "Wrong Credentials." };
        err.statusCode = 401;
        next(err);
        return;
      }

      res.status(200).json({
        message: "Login success!",
        result: {
          id: user.id,
          name: user.name,
          is_admin: user.is_admin,
        },
      });
    });
  } catch (error) {
    next(error);
  }
}
