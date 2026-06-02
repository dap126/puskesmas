-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 02, 2026 at 03:12 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_puskesmas`
--

-- --------------------------------------------------------

--
-- Table structure for table `antrean`
--

CREATE TABLE `antrean` (
  `idantrean` int NOT NULL,
  `tgl_antrean` date NOT NULL,
  `no_antrean` varchar(6) NOT NULL,
  `status` enum('Menunggu','Selesai') NOT NULL DEFAULT 'Menunggu',
  `pasien_idpasien` int NOT NULL,
  `poli_id_poli` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `antrean`
--

INSERT INTO `antrean` (`idantrean`, `tgl_antrean`, `no_antrean`, `status`, `pasien_idpasien`, `poli_id_poli`) VALUES
(24, '2026-06-02', 'PU-001', 'Selesai', 1, 1),
(25, '2026-06-02', 'PU-002', 'Selesai', 2, 1),
(26, '2026-06-02', 'PG-001', 'Selesai', 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `detail_resep`
--

CREATE TABLE `detail_resep` (
  `id_detail` int NOT NULL,
  `no_resep` varchar(20) NOT NULL,
  `jumlah_obat` int NOT NULL,
  `dosis` varchar(50) NOT NULL,
  `resep_obat_id_resep` int NOT NULL,
  `obat_id_obat` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `detail_resep`
--

INSERT INTO `detail_resep` (`id_detail`, `no_resep`, `jumlah_obat`, `dosis`, `resep_obat_id_resep`, `obat_id_obat`) VALUES
(1, 'RSP-260602-001', 10, '3x1 Sesudah Makan', 1, 1),
(2, 'RSP-260602-001', 1, '3x1 Sebelum Makan', 1, 4),
(3, 'RSP-260520-001', 15, '3x1 Sesudah Makan', 2, 3),
(4, 'RSP-260520-001', 15, '3x1 Dihabiskan', 2, 2),
(5, 'RSP-260602-002', 2, '3x1', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `dokter`
--

CREATE TABLE `dokter` (
  `id_dokter` int NOT NULL,
  `nama_dokter` varchar(100) NOT NULL,
  `nip` varchar(50) NOT NULL,
  `no_telepon` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `jadwal_praktik` varchar(100) NOT NULL,
  `users_idusers` int DEFAULT NULL,
  `poli_id_poli` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `dokter`
--

INSERT INTO `dokter` (`id_dokter`, `nama_dokter`, `nip`, `no_telepon`, `jadwal_praktik`, `users_idusers`, `poli_id_poli`) VALUES
(1, 'Dr. Andi Pratama', '198001012005011001', '081234567890', 'Senin - Rabu, 08:00 - 14:00', 3, 1),
(2, 'Dr. Siti Aminah', '198502022010012002', '081987654321', 'Kamis - Sabtu, 08:00 - 14:00', 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `obat`
--

CREATE TABLE `obat` (
  `id_obat` int NOT NULL,
  `nama_obat` varchar(100) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `stok` int NOT NULL,
  `satuan` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `obat`
--

INSERT INTO `obat` (`id_obat`, `nama_obat`, `kategori`, `stok`, `satuan`) VALUES
(1, 'Paracetamol 500mg', 'Analgesik/Antipiretik', 150, 'Strip'),
(2, 'Amoxicillin 500mg', 'Antibiotik', 80, 'Strip'),
(3, 'Asam Mefenamat 500mg', 'Analgesik', 100, 'Strip'),
(4, 'Antasida Doen', 'Obat Lambung', 50, 'Botol'),
(5, 'Vitamin C 50mg', 'Suplemen/Vitamin', 200, 'Tablet');

-- --------------------------------------------------------

--
-- Table structure for table `pasien`
--

CREATE TABLE `pasien` (
  `idpasien` int NOT NULL,
  `nik` varchar(16) NOT NULL,
  `nama_pasien` varchar(100) NOT NULL,
  `tgl_lahir` date NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `alamat` text NOT NULL,
  `no_telepon` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pasien`
--

INSERT INTO `pasien` (`idpasien`, `nik`, `nama_pasien`, `tgl_lahir`, `jenis_kelamin`, `alamat`, `no_telepon`) VALUES
(1, '3201010101900001', 'Ahmad Rizal', '1990-01-15', 'Laki-laki', 'Jl. Pajajaran No.1, Bogor', '085111222333'),
(2, '3174010202950002', 'Budi Santoso', '1995-05-20', 'Laki-laki', 'Jl. Sudirman No.5, Jakarta Selatan', '085222333444'),
(3, '3201010303800003', 'Rina Kartika', '1980-08-10', 'Perempuan', 'Jl. Raya Ciampea, Bogor', '085333444555');

-- --------------------------------------------------------

--
-- Table structure for table `poli`
--

CREATE TABLE `poli` (
  `id_poli` int NOT NULL,
  `nama_poli` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `poli`
--

INSERT INTO `poli` (`id_poli`, `nama_poli`) VALUES
(1, 'Poli Umum'),
(2, 'Poli Gigi'),
(3, 'Poli KIA (Kesehatan Ibu & Anak)');

-- --------------------------------------------------------

--
-- Table structure for table `rekam_medis`
--

CREATE TABLE `rekam_medis` (
  `id_rm` int NOT NULL,
  `tgl_periksa` datetime NOT NULL,
  `keluhan` text NOT NULL,
  `tinggi_badan` int NOT NULL,
  `berat_badan` int DEFAULT NULL,
  `tekanan_darah` varchar(20) DEFAULT NULL,
  `diagnosa` text,
  `pasien_idpasien` int NOT NULL,
  `dokter_id_dokter` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `rekam_medis`
--

INSERT INTO `rekam_medis` (`id_rm`, `tgl_periksa`, `keluhan`, `tinggi_badan`, `berat_badan`, `tekanan_darah`, `diagnosa`, `pasien_idpasien`, `dokter_id_dokter`) VALUES
(1, '2026-06-02 09:15:00', 'Demam tinggi selama 3 hari, pusing, mual, dan badan terasa ngilu.', 170, 65, '120/80', 'Suspect Demam Berdarah Dengue / Tifus', 1, 1),
(2, '2026-05-20 10:00:00', 'Sakit gigi geraham bawah sebelah kiri sejak semalam, bengkak.', 158, 55, '110/70', 'Karies Gigi dan Gingivitis', 3, 2),
(3, '2026-06-02 14:31:33', 'Pusing, mual-mual', 180, 90, '100/90', 'Demam', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `resep_obat`
--

CREATE TABLE `resep_obat` (
  `id_resep` int NOT NULL,
  `tgl_resep` datetime NOT NULL,
  `status_tebus` enum('belum','sudah','batal') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `rekam_medis_id_rm` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `resep_obat`
--

INSERT INTO `resep_obat` (`id_resep`, `tgl_resep`, `status_tebus`, `rekam_medis_id_rm`) VALUES
(1, '2026-06-02 09:30:00', 'belum', 1),
(2, '2026-05-20 10:15:00', 'sudah', 2),
(3, '2026-06-02 21:31:33', 'batal', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idusers` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','dokter') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`idusers`, `username`, `nama`, `password`, `role`) VALUES
(1, 'admin', NULL, '$2b$10$J0aC32UtxGLsEWX0FwugL.npzHNUe9zaXO6t0oie3Rnl1e/W9coQ.', 'admin'),
(2, 'staff_loket', 'Rina Staff', '$2b$10$J0aC32UtxGLsEWX0FwugL.npzHNUe9zaXO6t0oie3Rnl1e/W9coQ.', 'staff'),
(3, 'dr_andi', 'Dr. Andi Pratama', '$2b$10$J0aC32UtxGLsEWX0FwugL.npzHNUe9zaXO6t0oie3Rnl1e/W9coQ.', 'dokter'),
(4, 'dr_siti', 'Dr. Siti Aminah', '$2b$10$J0aC32UtxGLsEWX0FwugL.npzHNUe9zaXO6t0oie3Rnl1e/W9coQ.', 'dokter');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `antrean`
--
ALTER TABLE `antrean`
  ADD PRIMARY KEY (`idantrean`),
  ADD KEY `fk_antrean_pasien1_idx` (`pasien_idpasien`),
  ADD KEY `fk_antrean_poli1_idx` (`poli_id_poli`);

--
-- Indexes for table `detail_resep`
--
ALTER TABLE `detail_resep`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `fk_detail_resep_resep_obat1_idx` (`resep_obat_id_resep`),
  ADD KEY `fk_detail_resep_obat1_idx` (`obat_id_obat`);

--
-- Indexes for table `dokter`
--
ALTER TABLE `dokter`
  ADD PRIMARY KEY (`id_dokter`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD KEY `fk_dokter_users_idx` (`users_idusers`),
  ADD KEY `fk_dokter_poli1_idx` (`poli_id_poli`);

--
-- Indexes for table `obat`
--
ALTER TABLE `obat`
  ADD PRIMARY KEY (`id_obat`),
  ADD UNIQUE KEY `nama obat_UNIQUE` (`nama_obat`);

--
-- Indexes for table `pasien`
--
ALTER TABLE `pasien`
  ADD PRIMARY KEY (`idpasien`),
  ADD UNIQUE KEY `nik_UNIQUE` (`nik`);

--
-- Indexes for table `poli`
--
ALTER TABLE `poli`
  ADD PRIMARY KEY (`id_poli`);

--
-- Indexes for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  ADD PRIMARY KEY (`id_rm`),
  ADD KEY `fk_rekam_medis_pasien1_idx` (`pasien_idpasien`),
  ADD KEY `fk_rekam_medis_dokter1_idx` (`dokter_id_dokter`);

--
-- Indexes for table `resep_obat`
--
ALTER TABLE `resep_obat`
  ADD PRIMARY KEY (`id_resep`),
  ADD KEY `fk_resep_obat_rekam_medis1_idx` (`rekam_medis_id_rm`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idusers`),
  ADD UNIQUE KEY `idusers_UNIQUE` (`idusers`),
  ADD UNIQUE KEY `nama` (`nama`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `antrean`
--
ALTER TABLE `antrean`
  MODIFY `idantrean` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `detail_resep`
--
ALTER TABLE `detail_resep`
  MODIFY `id_detail` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dokter`
--
ALTER TABLE `dokter`
  MODIFY `id_dokter` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `obat`
--
ALTER TABLE `obat`
  MODIFY `id_obat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pasien`
--
ALTER TABLE `pasien`
  MODIFY `idpasien` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `poli`
--
ALTER TABLE `poli`
  MODIFY `id_poli` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  MODIFY `id_rm` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `resep_obat`
--
ALTER TABLE `resep_obat`
  MODIFY `id_resep` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `idusers` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `antrean`
--
ALTER TABLE `antrean`
  ADD CONSTRAINT `fk_antrean_pasien1` FOREIGN KEY (`pasien_idpasien`) REFERENCES `pasien` (`idpasien`),
  ADD CONSTRAINT `fk_antrean_poli1` FOREIGN KEY (`poli_id_poli`) REFERENCES `poli` (`id_poli`);

--
-- Constraints for table `detail_resep`
--
ALTER TABLE `detail_resep`
  ADD CONSTRAINT `fk_detail_resep_obat1` FOREIGN KEY (`obat_id_obat`) REFERENCES `obat` (`id_obat`),
  ADD CONSTRAINT `fk_detail_resep_resep_obat1` FOREIGN KEY (`resep_obat_id_resep`) REFERENCES `resep_obat` (`id_resep`);

--
-- Constraints for table `dokter`
--
ALTER TABLE `dokter`
  ADD CONSTRAINT `fk_dokter_poli1` FOREIGN KEY (`poli_id_poli`) REFERENCES `poli` (`id_poli`),
  ADD CONSTRAINT `fk_dokter_users` FOREIGN KEY (`users_idusers`) REFERENCES `users` (`idusers`);

--
-- Constraints for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  ADD CONSTRAINT `fk_rekam_medis_dokter1` FOREIGN KEY (`dokter_id_dokter`) REFERENCES `dokter` (`id_dokter`),
  ADD CONSTRAINT `fk_rekam_medis_pasien1` FOREIGN KEY (`pasien_idpasien`) REFERENCES `pasien` (`idpasien`);

--
-- Constraints for table `resep_obat`
--
ALTER TABLE `resep_obat`
  ADD CONSTRAINT `fk_resep_obat_rekam_medis1` FOREIGN KEY (`rekam_medis_id_rm`) REFERENCES `rekam_medis` (`id_rm`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
