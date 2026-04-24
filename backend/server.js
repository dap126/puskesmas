const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const antreanRoutes = require('./routes/antrean');
const dokterRoutes = require('./routes/dokter');
const medisRoutes = require('./routes/medis');
const poliRoutes = require('./routes/poli');
const pasienRoutes = require('./routes/pasien');
const obatRoutes = require('./routes/obat');
const resepRoutes = require('./routes/resep');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fallback to prevent crashes from undefined req.body when Content-Type is missing
app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});

app.get('/', (req, res) => {
  res.send('Puskesmas API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/antrean', antreanRoutes);
app.use('/api/dokter', dokterRoutes);
app.use('/api/medis', medisRoutes);
app.use('/api', poliRoutes);
app.use('/api', pasienRoutes);
app.use('/api', obatRoutes);
app.use('/api', resepRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
