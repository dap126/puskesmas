const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database:', process.env.DB_NAME);
});

module.exports = db;
