const db = require('./config/db');

db.query('DESCRIBE pasien', (err, results) => {
    if (err) throw err;
    console.log(results);
    process.exit();
});
