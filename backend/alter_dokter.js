const db = require('./config/db');

db.query('ALTER TABLE dokter MODIFY COLUMN users_idusers INT NULL', (err, results) => {
    if (err) throw err;
    console.log("Column users_idusers is now nullable.");
    process.exit();
});
