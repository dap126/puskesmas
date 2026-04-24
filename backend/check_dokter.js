const db = require('./config/db');

db.query('DESCRIBE dokter', (err, results) => {
    if (err) throw err;
    console.log(results);
    process.exit();
});
