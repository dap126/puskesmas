const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    // process.exit(1); // Jangan matikan server jika gagal konek (agar error bisa dilihat di endpoint)
  }
  if (connection) connection.release();
  console.log('Connected to MySQL database:', process.env.DB_NAME);
});

module.exports = db;
