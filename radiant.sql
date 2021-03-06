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
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Account` char(128) NOT NULL,
  `Password` char(128) NOT NULL,
  `Enable` tinyint(1) NOT NULL DEFAULT '1',
  `SuperUser` tinyint(1) NOT NULL DEFAULT '0',
  `CreateDate` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
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
  `UserId` int(11) NOT NULL,
  `Address` int(11) NOT NULL,
  `Info1` int(11) NOT NULL DEFAULT 0,
  `Info2` int(11) NOT NULL DEFAULT 0,
  `Info3` int(11) NOT NULL DEFAULT 0,
  `TypeId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`UserId`, `Address`)
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
-- Table structure for table `GroupTbl`
--

DROP TABLE IF EXISTS `GroupTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GroupTbl` (
  `UserId` int(11) NOT NULL,
  `Address` int(11) NOT NULL,
  `GroupId` int(11) NOT NULL,
  PRIMARY KEY (`UserId`, `Address`, `GroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupTbl`
--

LOCK TABLES `GroupTbl` WRITE;
/*!40000 ALTER TABLE `GroupTbl` DISABLE KEYS */;
/*!40000 ALTER TABLE `GroupTbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SceneTbl`
--

DROP TABLE IF EXISTS `SceneTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SceneTbl` (
  `UserId` int(11) NOT NULL,
  `Address` int(11) NOT NULL,
  `SceneId` int(11) NOT NULL,
  `ScenePage` int(11) NOT NULL DEFAULT 255,
  `Lum` int(11) NOT NULL DEFAULT 0,
  `RgbR` int(11) NOT NULL DEFAULT 0,
  `RgbG` int(11) NOT NULL DEFAULT 0,
  `RgbB` int(11) NOT NULL DEFAULT 0,
  `Ct` int(11) NOT NULL DEFAULT 0,
  `Enable` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`UserId`, `Address`, `SceneId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SceneTbl`
--

LOCK TABLES `SceneTbl` WRITE;
/*!40000 ALTER TABLE `SceneTbl` DISABLE KEYS */;
/*!40000 ALTER TABLE `SceneTbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduleTbl`
--

DROP TABLE IF EXISTS `ScheduleTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScheduleTbl` (
  `UserId` int(11) NOT NULL,
  `Address` int(11) NOT NULL,
  `ScheduleId` int(11) NOT NULL,
  `SchedulePage` int(11) NOT NULL DEFAULT 255,
  `ScheType` int(11) NOT NULL DEFAULT 0,
  `Month` int(11) NOT NULL DEFAULT 0,
  `Day` int(11) NOT NULL DEFAULT 0,
  `Hour` int(11) NOT NULL DEFAULT 0,
  `Minute` int(11) NOT NULL DEFAULT 0,
  `Second` int(11) NOT NULL DEFAULT 0,
  `SceneId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`UserId`, `Address`, `ScheduleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduleTbl`
--

LOCK TABLES `ScheduleTbl` WRITE;
/*!40000 ALTER TABLE `ScheduleTbl` DISABLE KEYS */;
/*!40000 ALTER TABLE `ScheduleTbl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DeviceHistoryTbl`
--

DROP TABLE IF EXISTS `DeviceHistoryTbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DeviceHistoryTbl` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) DEFAULT NULL,
  `Address` int(11) NOT NULL DEFAULT 0,
  `Info1` int(11) NOT NULL DEFAULT 0,
  `Info2` int(11) NOT NULL DEFAULT 0,
  `Info3` int(11) NOT NULL DEFAULT 0,
  `TypeId` int(11) NOT NULL DEFAULT 0,
  `SourceAddress` int(11) NOT NULL DEFAULT 0,
  `UpdateDate` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
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
  `Id` int(11) NOT NULL DEFAULT 0,
  `Name` char(40) DEFAULT NULL,
  `TextInfo2` char(40) DEFAULT NULL,
  `TextInfo3` char(40) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DeviceTypeTbl`
--

LOCK TABLES `DeviceTypeTbl` WRITE;
/*!40000 ALTER TABLE `DeviceTypeTbl` DISABLE KEYS */;
INSERT INTO `DeviceTypeTbl` VALUES (1,'燈泡SC','亮度','無意義'),(2,'燈泡CX','亮度','無意義'),(3,'燈泡RGB','亮度','無意義'),(4,'燈泡RGBCX','亮度','無意義'),
(5,'燈條SC','亮度','無意義'),(6,'燈條CX','亮度','無意義'),(7,'燈條RGB','亮度','無意義'),(8,'燈條RGBCX','亮度','無意義'),
(9,'嵌燈SC','亮度','無意義'),(10,'嵌燈CX','亮度','無意義'),(11,'嵌燈RGB','亮度','無意義'),(12,'嵌燈RGBCX','亮度','無意義'),
(13,'平板燈SC','亮度','無意義'),(14,'平板燈CX','亮度','無意義'),(15,'平板燈RGB','亮度','無意義'),(16,'平板燈RGBCX','亮度','無意義'),
(17,'軌道燈SC','亮度','無意義'),(18,'軌道燈CX','亮度','無意義'),(19,'軌道燈RGB','亮度','無意義'),(20,'軌道燈RGBCX','亮度','無意義'),
(97,'套裝組燈泡SC','亮度','無意義'),(98,'套裝組燈泡CX','亮度','無意義'),(99,'套裝組燈泡RGB','亮度','無意義'),(100,'套裝組燈泡RGBCX','亮度','無意義'),
(101,'套裝組燈條SC','亮度','無意義'),(102,'套裝組燈條CX','亮度','無意義'),(103,'套裝組燈條RGB','亮度','無意義'),(104,'套裝組燈條RGBCX','亮度','無意義'),
(105,'套裝組嵌燈SC','亮度','無意義'),(106,'套裝組嵌燈CX','亮度','無意義'),(107,'套裝組嵌燈RGB','亮度','無意義'),(108,'套裝組嵌燈RGBCX','亮度','無意義'),
(65,'Smart driver SC','亮度','無意義'),(66,'Smart driver CX','亮度','無意義'),(67,'保留','保留','保留'),(68,'保留','保留','保留'),
(69,'泛光燈SC','亮度','無意義'),(70,'泛光燈CX','亮度','無意義'),(71,'泛光燈RGB','亮度','無意義'),(72,'泛光燈RGBCX','亮度','無意義'),
(73,'吸頂燈SC','亮度','無意義'),(74,'吸頂燈CX','亮度','無意義'),(75,'吸頂燈RGB','亮度','無意義'),(76,'吸頂燈RGBCX','亮度','無意義'),
(77,'條形燈SC','亮度','無意義'),(78,'條形燈CX','亮度','無意義'),(79,'條形燈RGB','亮度','無意義'),(80,'條形燈RGBCX','亮度','無意義'),
(81,'Relay繼電器','啟用禁用','無意義'),(82,'Dimmer調光器','保留','保留'),(31,'Wall switch','無意義','無意義'),(32,'Pir','啟用禁用','無意義'),
(33,'Combo switch','無意義','無意義'),(34,'Scene switch','無意義','無意義'),(35,'Hcl_12','啟用禁用','無意義'),(36,'Light sensor','啟用禁用','照度'),
(37,'Dynamic scene(舊版，不維護)','啟用禁用','無意義'),(38,'Repeater','啟用禁用','無意義'),(39,'Dynamic scene(新版)','啟用禁用','無意義'),(40,'Detector','無意義','無意義'),
(41,'Socket(舊版，不維護)','啟用禁用','無意義'),(42,'Fan control','風速','下燈模式亮度'),(43,'Hcl_24','啟用禁用','無意義'),(44,'Photo cell Pir','啟用禁用','照度'),
(45,'Switch direct','無意義','無意義'),(46,'Repeater new','啟用禁用','無意義'),(47,'Push-Dim','無意義','無意義'),(48,'Curtain(不維護)','保留','保留'),
(49,'Voice(開發中)','保留','保留'),(50,'Switch direct 4-8','無意義','無意義'),(51,'Repeater new RTC','啟用禁用','無意義'),(201,'Scene Socket','啟用禁用','無意義');
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
