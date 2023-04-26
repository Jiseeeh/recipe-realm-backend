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

async function init() {
  try {
    const migrationDir = path.join(__dirname, "migrations");
    const migrationsFiles = fs.readdirSync(migrationDir).reverse();

    for (const file of migrationsFiles) {
      const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8");
      await pool.query(sql);
      console.log("Migrate Success!");
    }
  } catch (error) {
    // re throw for error handler in index.js
    throw error;
  }
}

export { pool, init };
