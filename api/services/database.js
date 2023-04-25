import mysql from "mysql2";
import fs from "fs";
import path from "path";

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();

// async function init(_, __, next) {
//   const files = ["user_init.sql", "recipe_init.sql"];

//   for (const file of files) {
//     const data = await fs.promises.readFile(
//       path.join("api", "migrations", file),
//       "utf-8"
//     );

//     await pool.query(data);
//   }
//   next();
// }

export { pool };
