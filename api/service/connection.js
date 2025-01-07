const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: "localhost", 
  port: 3333,
  user: "root",
  password: "admin",
  database: "campuslog",
});

async function asyncFunction() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * from roles");
      console.log(rows);
      return rows
    } catch (err) {
      console.error('Database connection error:', err);
    } finally {
      if (conn) await conn.release(); // Use release() instead of end()
    }
  }
  
module.exports = { asyncFunction }