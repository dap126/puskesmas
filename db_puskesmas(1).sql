-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 28, 2026 at 02:19 PM
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
(2, '2026-04-24', 'PA-01', 'Menunggu', 2, 3),
(3, '2026-04-25', 'PG-01', 'Selesai', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `detail_resep`
--

CREATE TABLE `detail_resep` (
  `id_detail` int NOT NULL,
  `jumlah_obat` int NOT NULL,
  `dosis` varchar(50) NOT NULL,
  `resep_obat_id_resep` int NOT NULL,
  `obat_id_obat` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `dokter`
--

CREATE TABLE `dokter` (
  `id_dokter` int NOT NULL,
  `nama_dokter` varchar(100) NOT NULL,
  `nip` varchar(50) NOT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `jadwal_praktik` varchar(100) NOT NULL,
  `users_idusers` int DEFAULT NULL,
  `poli_id_poli` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `dokter`
--

INSERT INTO `dokter` (`id_dokter`, `nama_dokter`, `nip`, `no_hp`, `jadwal_praktik`, `users_idusers`, `poli_id_poli`) VALUES
(27, 'dr. Agus Rusdi', '198001012005011001', '081234567890', 'Senin - Rabu, 08:00 - 14:00', NULL, 1),
(28, 'drg. Budi Santoso', '198205122008031002', NULL, 'Selasa - Kamis, 09:00 - 15:00', NULL, 2),
(29, 'dr. Citra Lestari, Sp.A', '198511202010122001', '085678901234', 'Senin & Kamis, 10:00 - 16:00', NULL, 3),
(30, 'dr. Dian Pertiwi', '199003152015042003', '081122334455', 'Jumat - Sabtu, 08:00 - 13:00', NULL, 1),
(31, 'drg. Eko Prasetyo', '198807222012111004', '082233445566', 'Senin, Rabu, Jumat, 14:00 - 20:00', NULL, 2),
(32, 'dr. Fitriani, Sp.OG', '198309082009022005', NULL, 'Selasa & Jumat, 08:00 - 12:00', NULL, 3),
(33, 'dr. Gunawan Wibisono', '197912302005011006', '081345678901', 'Senin - Kamis, 16:00 - 21:00', NULL, 1),
(34, 'dr. Hendra Syahputra', '199201102018031007', '085712345678', 'Selasa, Kamis, Sabtu, 08:00 - 14:00', NULL, 1),
(35, 'drg. Indah Permatasari', '198704182014052008', '087811223344', 'Senin - Rabu, 09:00 - 14:00', NULL, 2),
(36, 'dr. Joko Susilo, Sp.A', '198106252006041009', '089988776655', 'Rabu & Sabtu, 10:00 - 15:00', NULL, 3);

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
(1, 'Paracetamol 500mg', 'Tablet', 250, 'Strip'),
(2, 'Amoxicillin 500mg', 'Kapsul', 120, 'Strip'),
(3, 'Sanmol Sirup Anak 60ml', 'Sirup', 45, 'Botol'),
(4, 'Ibuprofen 400mg', 'Tablet', 180, 'Strip'),
(5, 'Antasida Doen', 'Tablet', 300, 'Strip'),
(6, 'Cefadroxil 500mg', 'Kapsul', 80, 'Strip'),
(7, 'OBH Combi Batuk Berdahak', 'Sirup', 35, 'Botol'),
(8, 'Salep 2-4', 'Salep', 50, 'Pot'),
(9, 'Betadine Antiseptik 15ml', 'Cair', 40, 'Botol'),
(10, 'Vitamin C IPI 50mg', 'Tablet', 150, 'Botol'),
(11, 'Acyclovir 5% Krim', 'Salep', 25, 'Tube'),
(12, 'Cetirizine 10mg', 'Tablet', 100, 'Strip'),
(13, 'Dexamethasone 0.5mg', 'Tablet', 200, 'Strip'),
(14, 'Oresol / Oralit', 'Serbuk', 150, 'Sachet'),
(15, 'Gentamicin Tetes Mata', 'Cair', 30, 'Botol');

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
  `no_telpon` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pasien`
--

INSERT INTO `pasien` (`idpasien`, `nik`, `nama_pasien`, `tgl_lahir`, `jenis_kelamin`, `alamat`, `no_telpon`) VALUES
(2, '3201011508800001', 'Budi Santoso', '1980-08-15', 'Laki-laki', 'Jl. Merdeka No. 10, RT 01/RW 02, Ciampea', '081234567890'),
(3, '3201022005900002', 'Siti Aminah', '1990-05-20', 'Perempuan', 'Jl. Raya Bogor KM 40, Cibinong', '081345678901'),
(4, '3201031010750003', 'Andi Wijaya', '1975-10-10', 'Laki-laki', 'Perumahan Griya Indah Blok A/5, Bogor', '081456789012'),
(5, '3201041212950004', 'Dewi Lestari', '1995-12-12', 'Perempuan', 'Jl. Pahlawan No. 8, Tajur', '081567890123'),
(6, '3201050505850005', 'Rudi Hermawan', '1985-05-05', 'Laki-laki', 'Jl. Diponegoro No. 12, Ciomas', '081678901234'),
(7, '3201061708880006', 'Fitriani', '1988-08-17', 'Perempuan', 'Kp. Sawah Baru RT 04/01, Bojong Gede', '085212345678'),
(8, '3201072512920007', 'Hendra Pratama', '1992-12-25', 'Laki-laki', 'Jl. Mayor Oking No. 7, Citeureup', '085323456789'),
(9, '3201080101820008', 'Rina Susanti', '1982-01-01', 'Perempuan', 'Perum Bukit Asri Blok C/10, Leuwiliang', '085434567890'),
(10, '3201091402900009', 'Agus Setiawan', '1990-02-14', 'Laki-laki', 'Jl. Teuku Umar No. 11, Kedung Halang', '085545678901'),
(11, '3201103009980010', 'Maya Indah', '1998-09-30', 'Perempuan', 'Kp. Cikaret RT 02/05, Cibinong', '085656789012'),
(12, '3201111111700011', 'Dedi Saputra', '1970-11-11', 'Laki-laki', 'Jl. Ahmad Yani No. 2, Tanah Sareal', '085767890123'),
(13, '3201122204050012', 'Nina Karlina', '2005-04-22', 'Perempuan', 'Jl. Gajah Mada No. 6, Dramaga', '085878901234'),
(14, '3201130808800013', 'Eko Prasetyo', '1980-08-08', 'Laki-laki', 'Perumahan Alam Asri No. 15, Ciawi', '081122334455'),
(15, '3201141907930014', 'Sari Wulandari', '1993-07-19', 'Perempuan', 'Jl. Siliwangi No. 20, Sukasari', '081233445566'),
(16, '3201150202870015', 'Iwan Setiawan', '1987-02-02', 'Laki-laki', 'Jl. Pajajaran No. 4, Bantarjati', '081344556677'),
(17, '3201162810990016', 'Ratna Sari', '1999-10-28', 'Perempuan', 'Komp. IPB Sindang Barang, Bogor', '081455667788'),
(18, '3201170303650017', 'Joko Susanto', '1965-03-03', 'Laki-laki', 'Jl. Tentara Pelajar No. 18, Cimanggu', '081566778899'),
(19, '3201182104910018', 'Sri Rahayu', '1991-04-21', 'Perempuan', 'Kp. Muara Beres RT 01/01, Sukaraja', '081677889900'),
(20, '3201191506840019', 'Ahmad Dahlan', '1984-06-15', 'Laki-laki', 'Jl. Baru Kemang No. 30, Kemang', '085288990011'),
(21, '3201201010080020', 'Yulia Rahman', '2008-10-10', 'Perempuan', 'Jl. Raya Parung No. 50, Parung', '085399001122');

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
(3, 'Poli Anak');

-- --------------------------------------------------------

--
-- Table structure for table `rekam_medis`
--

CREATE TABLE `rekam_medis` (
  `id_rm` int NOT NULL,
  `tgl_periksa` datetime NOT NULL,
  `keluhan` text NOT NULL,
  `tinggi_badan` int NOT NULL,
  `berat_bedan` int DEFAULT NULL,
  `tekanan_darah` varchar(20) DEFAULT NULL,
  `diagnosa` text,
  `pasien_idpasien` int NOT NULL,
  `dokter_id_dokter` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `resep_obat`
--

CREATE TABLE `resep_obat` (
  `id_resep` int NOT NULL,
  `tgl_resep` datetime NOT NULL,
  `status_tebus` enum('belum','selesai') NOT NULL,
  `rekam_medis_id_rm` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idusers` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','resepsionis','dokter','apoteker') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`idusers`, `username`, `nama`, `password`, `role`) VALUES
(1, 'admin', NULL, '$2b$10$J0aC32UtxGLsEWX0FwugL.npzHNUe9zaXO6t0oie3Rnl1e/W9coQ.', 'admin'),
(2, 'agus', 'Dr. Agus', '$2b$10$5BzqN6nTuSAVxSew2BsI9ul8chsjRuuFevy1vIVNWSG6WMb4hj/Oy', 'dokter'),
(3, 'budi', 'Budiono Siregar', '$2b$10$.mKG5y3juuEJ7MjBRjmrjeB0stxyOcIy5/5vgoxn/ziBPKrX/LwbW', 'apoteker');

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
  MODIFY `idantrean` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `detail_resep`
--
ALTER TABLE `detail_resep`
  MODIFY `id_detail` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokter`
--
ALTER TABLE `dokter`
  MODIFY `id_dokter` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `obat`
--
ALTER TABLE `obat`
  MODIFY `id_obat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pasien`
--
ALTER TABLE `pasien`
  MODIFY `idpasien` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `poli`
--
ALTER TABLE `poli`
  MODIFY `id_poli` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  MODIFY `id_rm` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `resep_obat`
--
ALTER TABLE `resep_obat`
  MODIFY `id_resep` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `idusers` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
