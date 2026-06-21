const { Pool } = require("pg");

// Hosted Postgres providers (Neon, Render, Supabase, etc.) require SSL.
// Local Docker Postgres does not, so only enable it when explicitly asked
// or when the connection string clearly points at a hosted provider.
const needsSSL =
  process.env.DATABASE_SSL === "true" ||
  /neon\.tech|render\.com|supabase\.co/.test(process.env.DATABASE_URL || "");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSSL ? { rejectUnauthorized: false } : false,
});

module.exports = { query: (text, params) => pool.query(text, params), pool };
