import sql from "mssql";

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

export async function sqlQuery(query, returnRaw = false) {
  try {
    await sql.connect(sqlConfig);

    console.log({ query });
    const result = await sql.query(query);

    if (returnRaw) return result;

    return result.recordset;
  } catch (err) {
    // re throw
    console.log({ err });

    throw err;
  } finally {
    sql.close();
  }
}
