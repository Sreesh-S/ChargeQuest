-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: chargequest_db
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_admins`
--

DROP TABLE IF EXISTS `tbl_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_login` varchar(150) NOT NULL,
  `admin_password` varchar(150) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_admins`
--

LOCK TABLES `tbl_admins` WRITE;
/*!40000 ALTER TABLE `tbl_admins` DISABLE KEYS */;
INSERT INTO `tbl_admins` VALUES (1,'siteadmin','admin123');
/*!40000 ALTER TABLE `tbl_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chargetypes`
--

DROP TABLE IF EXISTS `tbl_chargetypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chargetypes` (
  `chargetype_id` int NOT NULL AUTO_INCREMENT,
  `chargetype_name` varchar(150) NOT NULL,
  `chargetype_desc` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`chargetype_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chargetypes`
--

LOCK TABLES `tbl_chargetypes` WRITE;
/*!40000 ALTER TABLE `tbl_chargetypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_chargetypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chargingports`
--

DROP TABLE IF EXISTS `tbl_chargingports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chargingports` (
  `cp_id` int NOT NULL AUTO_INCREMENT,
  `cs_id` int NOT NULL,
  `cp_name` varchar(100) DEFAULT NULL,
  `ct_id` int DEFAULT NULL,
  `cp_status` enum('Active','Inactive') DEFAULT NULL,
  PRIMARY KEY (`cp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chargingports`
--

LOCK TABLES `tbl_chargingports` WRITE;
/*!40000 ALTER TABLE `tbl_chargingports` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_chargingports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chargingstations`
--

DROP TABLE IF EXISTS `tbl_chargingstations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chargingstations` (
  `cs_id` int NOT NULL AUTO_INCREMENT,
  `cs_name` varchar(300) NOT NULL,
  `cs_location` varchar(200) NOT NULL,
  `cs_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`cs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chargingstations`
--

LOCK TABLES `tbl_chargingstations` WRITE;
/*!40000 ALTER TABLE `tbl_chargingstations` DISABLE KEYS */;
INSERT INTO `tbl_chargingstations` VALUES (1,'CStation01','{\"lat\":\"2.33\",\"long\":\"4.55\"}','Active'),(2,'CStation02','{\"lat\":\"2.54\",\"long\":\"3.22\"}','Active');
/*!40000 ALTER TABLE `tbl_chargingstations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(150) NOT NULL,
  `user_email` varchar(150) NOT NULL,
  `user_mobile` varchar(12) NOT NULL,
  `user_address` text NOT NULL,
  `user_city` varchar(100) NOT NULL,
  `user_dob` date NOT NULL,
  `user_pwd` varchar(100) NOT NULL,
  `user_status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users`
--

LOCK TABLES `tbl_users` WRITE;
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
INSERT INTO `tbl_users` VALUES (1,'Emil Edison','emil350z@gmail.com','9876543210','jkzfghjskg\r\nsjghksjfg\r\n','Kottayam','1990-10-10','Klem&Fandango1','active'),(2,'Jasmine Hernandez','jasmine_hern_rec@microsoft.com','9988776655','snsknfksrjgn\r\nslkdngskngg','Kottayam','1998-10-11','Klem&Fandango1','active');
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_vehicles`
--

DROP TABLE IF EXISTS `tbl_vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_vehicles` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `company` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `vehicle_colour` varchar(100) NOT NULL,
  `battery_capacity` int NOT NULL,
  `vehicle_range` int NOT NULL,
  `chargetype_id` int NOT NULL,
  PRIMARY KEY (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_vehicles`
--

LOCK TABLES `tbl_vehicles` WRITE;
/*!40000 ALTER TABLE `tbl_vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-15 13:33:33
