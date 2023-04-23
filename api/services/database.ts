import mysql from "mysql2";
import Pool from "mysql2/typings/mysql/lib/Pool";
import fs from "fs";
import path from "path";
import { NextFunction } from "express";

const pool: Pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })
  .promise();

function init(_, __, next: NextFunction) {
  // read multiple files if migrations > 1
  fs.readFile(
    path.join("api", "migrations", "init.sql"),
    "utf-8",
    (_, data) => {
      pool.query(data);
      next();
    }
  );
}

export { pool, init };
