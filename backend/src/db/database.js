import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();


const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


export async function initializeDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Tabel "items" siap digunakan.');
  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err);
    process.exit(1);
  }
}

export default pool;
