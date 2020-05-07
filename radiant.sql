-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: Radiant_db
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `UserTbl`
--

DROP TABLE IF EXISTS `UserTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserTbl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` char(128) NOT NULL,
  `password` char(128) NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT '1',
  `superUser` tinyint(1) NOT NULL DEFAULT '0',
  `createDate` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTbl`
--

LOCK TABLES `UserTbl` WRITE;
/*!40000 ALTER TABLE `UserTbl` DISABLE KEYS */;
INSERT INTO `UserTbl` VALUES (1,'aurora','123',1,1,1563333264),(2,'tywu','12345678',1,0,1564034324);
/*!40000 ALTER TABLE `UserTbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DeviceTbl`
--

DROP TABLE IF EXISTS `DeviceTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DeviceTbl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `address` int(8) NOT NULL DEFAULT 0,
  `info1` int(8) NOT NULL DEFAULT 0,
  `info2` int(8) NOT NULL DEFAULT 0,
  `info3` int(8) NOT NULL DEFAULT 0,
  `typeId` int(8) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DeviceTbl`
--

LOCK TABLES `DeviceTbl` WRITE;
/*!40000 ALTER TABLE `DeviceTbl` DISABLE KEYS */;
/*!40000 ALTER TABLE `DeviceTbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DeviceHistoryTbl`
--

DROP TABLE IF EXISTS `DeviceHistoryTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DeviceHistoryTbl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `address` int(8) NOT NULL DEFAULT 0,
  `info1` int(8) NOT NULL DEFAULT 0,
  `info2` int(8) NOT NULL DEFAULT 0,
  `info3` int(8) NOT NULL DEFAULT 0,
  `typeId` int(8) NOT NULL DEFAULT 0,
  `updateDate` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DeviceHistoryTbl`
--

LOCK TABLES `DeviceHistoryTbl` WRITE;
/*!40000 ALTER TABLE `DeviceHistoryTbl` DISABLE KEYS */;
/*!40000 ALTER TABLE `DeviceHistoryTbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DeviceTypeTbl`
--

DROP TABLE IF EXISTS `DeviceTypeTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DeviceTypeTbl` (
  `id` int(11) NOT NULL DEFAULT 0,
  `name` char(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DeviceTypeTbl`
--

LOCK TABLES `DeviceTypeTbl` WRITE;
/*!40000 ALTER TABLE `DeviceTypeTbl` DISABLE KEYS */;
/*!40000 ALTER TABLE `DeviceTypeTbl` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-20  9:19:42
