CREATE DATABASE IF NOT EXISTS `charquest-db`;
USE `charquest-db`;

DROP TABLE IF EXISTS `tbl_admins`;
CREATE TABLE `tbl_admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_login` varchar(150) NOT NULL,
  `admin_password` varchar(150) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

INSERT INTO `tbl_admins` VALUES (1,'siteadmin','admin123');

DROP TABLE IF EXISTS `tbl_chargetypes`;
CREATE TABLE `tbl_chargetypes` (
  `chargetype_id` int NOT NULL AUTO_INCREMENT,
  `chargetype_name` varchar(150) NOT NULL,
  `chargetype_desc` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`chargetype_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tbl_chargetypes` VALUES 
(1, 'CCS2', 'Combined Charging System 2 (DC Fast Charging)'),
(2, 'Type 2 AC', 'Mennekes connector for standard AC charging'),
(3, 'CHAdeMO', 'Japanese standard DC fast charging'),
(4, 'GB/T DC', 'Chinese standard DC fast charging'),
(5, 'NACS (Tesla)', 'North American Charging Standard');

DROP TABLE IF EXISTS `tbl_chargingstations`;
CREATE TABLE `tbl_chargingstations` (
  `chargingstation_id` int NOT NULL AUTO_INCREMENT,
  `chargingstation_name` varchar(300) NOT NULL,
  `chargingstation_lat` varchar(100) NOT NULL,
  `chargingstation_lng` varchar(100) NOT NULL,
  `chargingstation_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`chargingstation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tbl_chargingstations` VALUES 
(1, 'Kottayam Town EV Fast Charger', '9.5805097', '76.537262', 'Active'),
(2, 'Teekoy EV Hub', '9.5950000', '76.5450000', 'Active'),
(3, 'Pala Road Charge Station', '9.6200000', '76.5500000', 'Active');

DROP TABLE IF EXISTS `tbl_chargingports`;
CREATE TABLE `tbl_chargingports` (
  `chargingport_id` int NOT NULL AUTO_INCREMENT,
  `chargingstation_id` int NOT NULL,
  `chargingport_name` varchar(100) DEFAULT NULL,
  `chargetype_id` int DEFAULT NULL,
  `chargingport_status` enum('Active','Inactive','Occupied','Reserved') DEFAULT 'Active',
  PRIMARY KEY (`chargingport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tbl_chargingports` VALUES 
(1, 1, 'Port A - CCS2 (50kW)', 1, 'Active'),
(2, 1, 'Port B - Type 2 (22kW)', 2, 'Active'),
(3, 2, 'Port A - NACS (120kW)', 5, 'Active'),
(4, 3, 'Port A - CCS2 (60kW)', 1, 'Active'),
(5, 3, 'Port B - CHAdeMO (50kW)', 3, 'Active');

DROP TABLE IF EXISTS `tbl_users`;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

INSERT INTO `tbl_users` VALUES 
(1,'Emil Edison','emil350z@gmail.com','9876543210','Kottayam Main Road','Kottayam','1990-10-10','Klem&Fandango1','active'),
(2,'Jasmine Hernandez','jasmine_hern_rec@microsoft.com','9988776655','Infopark Phase 2','Kottayam','1998-10-11','Klem&Fandango1','active');

DROP TABLE IF EXISTS `tbl_vehicles`;
CREATE TABLE `tbl_vehicles` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `company` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `vehicle_colour` varchar(100) NOT NULL,
  `battery_capacity` int NOT NULL,
  `vehicle_range` int NOT NULL,
  `chargetype_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tbl_vehicles` VALUES
(1, 'Tata', 'Nexon EV Max', 'Teal Blue', 40, 312, 1, 1),
(2, 'Tesla', 'Model 3 Long Range', 'Solid Black', 75, 491, 5, 2);

DROP TABLE IF EXISTS `tbl_cities`;
CREATE TABLE `tbl_cities` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(100) NOT NULL,
  `country_code` varchar(2) NOT NULL DEFAULT 'IN',
  `city_lat` varchar(100) DEFAULT NULL,
  `city_lng` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tbl_cities` (`city_name`, `country_code`, `city_lat`, `city_lng`) VALUES 
('Kottayam', 'IN', '9.5805097', '76.537262'),
('Kochi', 'IN', '9.9312328', '76.2673041'),
('Trivandrum', 'IN', '8.5241391', '76.9366376'),
('Bangalore', 'IN', '12.9715987', '77.5945627');
