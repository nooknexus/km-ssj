/*
Navicat MariaDB Data Transfer

Source Server         : MariaDB
Source Server Version : 120102
Source Host           : localhost:3306
Source Database       : km_health_db

Target Server Type    : MariaDB
Target Server Version : 120102
File Encoding         : 65001

Date: 2026-01-15 10:14:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES ('1', 'โรคติดต่อ', 'http://localhost:5000/uploads/1765897028847-992267530.png', '2025-12-16 20:23:30');
INSERT INTO `categories` VALUES ('2', 'การส่งเสริมสุขภาพ', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');
INSERT INTO `categories` VALUES ('3', 'สุขภาพจิต', 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');
INSERT INTO `categories` VALUES ('4', 'โภชนาการ', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');
INSERT INTO `categories` VALUES ('5', 'อนามัยแม่และเด็ก', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `is_highlight` tinyint(1) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `attachment_url` varchar(255) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES ('1', '1', 'รู้จักกับโรคไข้เลือดออก', 'ไข้เลือดออกเกิดจากยุงลาย เป็นพาหะนำโรค อาการสำคัญคือไข้สูงลอย ปวดศีรษะ ปวดเมื่อยตามตัว มีจุดเลือดออกตามตัว...', '1', '14', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('2', '1', 'การป้องกัน COVID-19', 'สวมหน้ากากอนามัย ล้างมือบ่อยๆ และเว้นระยะห่างทางสังคม ยังคงเป็นมาตรการสำคัญในการป้องกันโรค...', '0', '28', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('3', '2', 'ออกกำลังกายวันละนิด จิตแจ่มใส', 'การออกกำลังกายอย่างน้อยวันละ 30 นาที ช่วยให้ร่างกายแข็งแรง ลดความเครียด และนอนหลับได้ดีขึ้น...', '1', '95', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('4', '2', '7 วิธีดูแลตัวเองฉบับพนักงานออฟฟิศ', 'เพื่อป้องกันโรคออฟฟิศซินโดรม ควรลุกเดินทุกชั่วโมง ยืดเหยียดกล้ามเนื้อ และพักสายตาจากหน้าจอคอมพิวเตอร์...', '0', '84', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('5', '3', 'เทคนิคจัดการความเครียด', 'ความเครียดสะสมส่งผลเสียต่อสุขภาพ ลองฝึกหายใจลึกๆ นั่งสมาธิ หรือหางานอดิเรกที่ชอบทำเพื่อผ่อนคลาย...', '1', '51', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('6', '3', 'สัญญาณเตือนโรคซึมเศร้า', 'หากรู้สึกเศร้า เบื่อหน่าย ท้อแท้ ไม่อยากทำอะไร ต่อเนื่องนานเกิน 2 สัปดาห์ ควรปรึกษาแพทย์...', '0', '21', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('7', '4', 'กินอาหารให้ครบ 5 หมู่', 'ร่างกายต้องการสารอาหารที่หลากหลาย ทั้งโปรตีน คาร์โบไฮเดรต ไขมัน วิตามิน และเกลือแร่ ในสัดส่วนที่เหมาะสม...', '1', '0', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('8', '4', 'ลดหวาน มัน เค็ม', 'การบริโภคน้ำตาล ไขมัน และโซเดียมมากเกินไป เป็นสาเหตุของโรคไม่ติดต่อเรื้อรัง (NCDs) เช่น เบาหวาน ความดัน...', '0', '17', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('9', '5', 'การเลี้ยงลูกด้วยนมแม่', 'นมแม่เป็นอาหารที่ดีที่สุดสำหรับทารก มีสารภูมิคุ้มกันที่ช่วยให้ลูกแข็งแรง พัฒนาการสมวัย...', '0', '24', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('10', '5', 'วัคซีนพื้นฐานสำหรับเด็ก', 'เด็กแรกเกิดถึง 12 ปี ควรได้รับวัคซีนตามเกณฑ์ของกระทรวงสาธารณสุข เพื่อป้องกันโรคติดต่อร้ายแรง...', '0', '64', '2025-12-16 20:23:30', null, '1');
INSERT INTO `items` VALUES ('19', '2', 'ทดสอบ', 'ทดสอบ', '0', '20', '2025-12-16 21:11:11', null, '1');
INSERT INTO `items` VALUES ('20', '2', 'ทดสอบ 2', 'ทดสอบ 2', '0', '24', '2025-12-16 21:16:24', null, '1');
INSERT INTO `items` VALUES ('21', '1', 'ทดสอบ 3', 'ทดสอบอัพโหลด', '0', '28', '2025-12-16 22:10:47', '/uploads/1765897847378-94377679.pdf', '1');
INSERT INTO `items` VALUES ('23', '1', 'ทดสอบ 5', 'ทดสอบ 5', '1', '146', '2025-12-16 22:29:28', '/uploads/1765898968212-664398473.jpg', '1');

-- ----------------------------
-- Table structure for item_attachments
-- ----------------------------
DROP TABLE IF EXISTS `item_attachments`;
CREATE TABLE `item_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `file_path` varchar(512) NOT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of item_attachments
-- ----------------------------
INSERT INTO `item_attachments` VALUES ('1', '23', '/uploads/1765898968212-664398473.jpg', 'image/jpeg', '92812504_3155679244466284_8196405602163884032_o.jpg', '2025-12-16 22:29:28');
INSERT INTO `item_attachments` VALUES ('2', '23', '/uploads/1765898968221-514369503.jpg', 'image/jpeg', '92586993_3155679151132960_5174561711864152064_o.jpg', '2025-12-16 22:29:28');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '$2b$10$rLUWkhlMFn8Sm09UhHXXs.jyCyEm/Q8OwC0PJ6UMjCkmR2H0NxF/6', 'admin@km.health', 'IT', 'admin', '2025-12-16 20:06:06');
INSERT INTO `users` VALUES ('2', 'testuser', '$2b$10$gV/JYrXKRRKcd2mHDY5xBeCmEgAXm7LNk1gCRh4kZJK0rewgg2kK.', 'test@mail.com', '', 'user', '2025-12-16 20:53:46');

-- ----------------------------
-- Table structure for user_history
-- ----------------------------
DROP TABLE IF EXISTS `user_history`;
CREATE TABLE `user_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `accessed_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of user_history
-- ----------------------------
INSERT INTO `user_history` VALUES ('1', null, '19', '2025-12-16 21:11:18');
INSERT INTO `user_history` VALUES ('2', null, '19', '2025-12-16 21:11:18');
INSERT INTO `user_history` VALUES ('3', null, '19', '2025-12-16 21:17:16');
INSERT INTO `user_history` VALUES ('4', null, '19', '2025-12-16 21:17:16');
INSERT INTO `user_history` VALUES ('5', null, '19', '2025-12-16 21:17:23');
INSERT INTO `user_history` VALUES ('6', null, '19', '2025-12-16 21:17:23');
INSERT INTO `user_history` VALUES ('7', null, '19', '2025-12-16 21:32:26');
INSERT INTO `user_history` VALUES ('8', null, '19', '2025-12-16 21:32:26');
INSERT INTO `user_history` VALUES ('9', null, '20', '2025-12-16 22:10:11');
INSERT INTO `user_history` VALUES ('10', null, '20', '2025-12-16 22:10:11');
INSERT INTO `user_history` VALUES ('11', null, '21', '2025-12-16 22:10:53');
INSERT INTO `user_history` VALUES ('12', null, '21', '2025-12-16 22:10:53');
INSERT INTO `user_history` VALUES ('13', null, '21', '2025-12-16 22:12:07');
INSERT INTO `user_history` VALUES ('14', null, '21', '2025-12-16 22:12:07');
INSERT INTO `user_history` VALUES ('15', null, '21', '2025-12-16 22:12:33');
INSERT INTO `user_history` VALUES ('16', null, '21', '2025-12-16 22:12:33');
INSERT INTO `user_history` VALUES ('17', null, '20', '2025-12-16 22:16:46');
INSERT INTO `user_history` VALUES ('18', null, '20', '2025-12-16 22:16:46');
INSERT INTO `user_history` VALUES ('23', null, '23', '2025-12-16 22:29:31');
INSERT INTO `user_history` VALUES ('24', null, '23', '2025-12-16 22:29:31');
INSERT INTO `user_history` VALUES ('27', null, '23', '2025-12-16 22:29:52');
INSERT INTO `user_history` VALUES ('28', null, '23', '2025-12-16 22:29:52');
INSERT INTO `user_history` VALUES ('29', null, '20', '2025-12-16 22:30:00');
INSERT INTO `user_history` VALUES ('30', null, '20', '2025-12-16 22:30:00');
INSERT INTO `user_history` VALUES ('31', null, '21', '2025-12-16 22:30:04');
INSERT INTO `user_history` VALUES ('32', null, '21', '2025-12-16 22:30:04');
INSERT INTO `user_history` VALUES ('33', null, '23', '2025-12-16 22:30:12');
INSERT INTO `user_history` VALUES ('34', null, '23', '2025-12-16 22:30:12');
INSERT INTO `user_history` VALUES ('35', null, '23', '2025-12-16 22:31:03');
INSERT INTO `user_history` VALUES ('36', null, '23', '2025-12-16 22:31:03');
INSERT INTO `user_history` VALUES ('37', null, '9', '2025-12-16 22:32:55');
INSERT INTO `user_history` VALUES ('38', null, '9', '2025-12-16 22:32:55');
INSERT INTO `user_history` VALUES ('39', null, '23', '2025-12-16 22:32:59');
INSERT INTO `user_history` VALUES ('40', null, '23', '2025-12-16 22:32:59');
INSERT INTO `user_history` VALUES ('41', null, '23', '2025-12-17 10:02:30');
INSERT INTO `user_history` VALUES ('42', null, '23', '2025-12-17 10:02:30');
INSERT INTO `user_history` VALUES ('43', null, '20', '2025-12-17 12:41:03');
INSERT INTO `user_history` VALUES ('44', null, '20', '2025-12-17 12:41:03');
INSERT INTO `user_history` VALUES ('45', null, '9', '2025-12-17 13:29:40');
INSERT INTO `user_history` VALUES ('46', null, '9', '2025-12-17 13:29:40');
INSERT INTO `user_history` VALUES ('47', null, '9', '2025-12-17 13:29:44');
INSERT INTO `user_history` VALUES ('48', null, '9', '2025-12-17 13:29:44');
INSERT INTO `user_history` VALUES ('49', null, '23', '2025-12-17 13:29:52');
INSERT INTO `user_history` VALUES ('50', null, '23', '2025-12-17 13:29:52');
INSERT INTO `user_history` VALUES ('51', null, '23', '2025-12-17 13:33:37');
INSERT INTO `user_history` VALUES ('52', null, '23', '2025-12-17 13:33:37');
INSERT INTO `user_history` VALUES ('53', null, '23', '2025-12-17 13:33:55');
INSERT INTO `user_history` VALUES ('54', null, '23', '2025-12-17 13:33:55');
INSERT INTO `user_history` VALUES ('55', null, '23', '2025-12-17 13:35:58');
INSERT INTO `user_history` VALUES ('56', null, '23', '2025-12-17 13:35:58');
INSERT INTO `user_history` VALUES ('57', null, '23', '2025-12-17 13:37:48');
INSERT INTO `user_history` VALUES ('58', null, '23', '2025-12-17 13:37:48');
INSERT INTO `user_history` VALUES ('59', null, '23', '2025-12-17 13:37:56');
INSERT INTO `user_history` VALUES ('60', null, '23', '2025-12-17 13:37:56');
INSERT INTO `user_history` VALUES ('63', null, '1', '2025-12-17 13:41:45');
INSERT INTO `user_history` VALUES ('64', null, '1', '2025-12-17 13:41:45');
INSERT INTO `user_history` VALUES ('65', null, '23', '2025-12-17 13:44:52');
INSERT INTO `user_history` VALUES ('66', null, '23', '2025-12-17 13:44:52');
INSERT INTO `user_history` VALUES ('67', null, '23', '2025-12-17 13:51:03');
INSERT INTO `user_history` VALUES ('68', null, '23', '2025-12-17 13:51:03');
INSERT INTO `user_history` VALUES ('69', null, '23', '2025-12-17 13:51:30');
INSERT INTO `user_history` VALUES ('70', null, '23', '2025-12-17 13:51:30');
INSERT INTO `user_history` VALUES ('71', null, '23', '2025-12-17 14:21:07');
INSERT INTO `user_history` VALUES ('72', null, '23', '2025-12-17 14:21:07');
INSERT INTO `user_history` VALUES ('73', null, '23', '2025-12-17 14:23:18');
INSERT INTO `user_history` VALUES ('74', null, '23', '2025-12-17 14:23:18');
INSERT INTO `user_history` VALUES ('75', null, '23', '2025-12-17 14:23:36');
INSERT INTO `user_history` VALUES ('76', null, '23', '2025-12-17 14:23:36');
INSERT INTO `user_history` VALUES ('77', null, '23', '2025-12-17 14:24:19');
INSERT INTO `user_history` VALUES ('78', null, '23', '2025-12-17 14:24:19');
INSERT INTO `user_history` VALUES ('79', null, '23', '2025-12-17 14:34:03');
INSERT INTO `user_history` VALUES ('80', null, '23', '2025-12-17 14:34:03');
INSERT INTO `user_history` VALUES ('81', null, '23', '2025-12-17 15:46:45');
INSERT INTO `user_history` VALUES ('82', null, '23', '2025-12-17 15:46:45');
INSERT INTO `user_history` VALUES ('83', null, '23', '2025-12-17 15:52:02');
INSERT INTO `user_history` VALUES ('84', null, '23', '2025-12-17 15:52:02');
INSERT INTO `user_history` VALUES ('85', null, '20', '2025-12-17 15:52:08');
INSERT INTO `user_history` VALUES ('86', null, '20', '2025-12-17 15:52:08');
INSERT INTO `user_history` VALUES ('87', null, '23', '2025-12-17 15:53:03');
INSERT INTO `user_history` VALUES ('88', null, '23', '2025-12-17 15:53:03');
INSERT INTO `user_history` VALUES ('89', null, '3', '2025-12-17 15:53:06');
INSERT INTO `user_history` VALUES ('90', null, '3', '2025-12-17 15:53:06');
INSERT INTO `user_history` VALUES ('91', null, '23', '2025-12-17 15:53:11');
INSERT INTO `user_history` VALUES ('92', null, '23', '2025-12-17 15:53:11');
INSERT INTO `user_history` VALUES ('93', null, '23', '2025-12-17 15:53:14');
INSERT INTO `user_history` VALUES ('94', null, '23', '2025-12-17 15:53:14');
INSERT INTO `user_history` VALUES ('95', null, '23', '2025-12-17 15:53:22');
INSERT INTO `user_history` VALUES ('96', null, '23', '2025-12-17 15:53:22');
INSERT INTO `user_history` VALUES ('97', null, '23', '2025-12-18 14:55:56');
INSERT INTO `user_history` VALUES ('98', null, '23', '2025-12-18 14:55:56');
INSERT INTO `user_history` VALUES ('99', null, '2', '2025-12-18 14:56:00');
INSERT INTO `user_history` VALUES ('100', null, '2', '2025-12-18 14:56:00');
INSERT INTO `user_history` VALUES ('101', null, '23', '2025-12-18 14:56:37');
INSERT INTO `user_history` VALUES ('102', null, '23', '2025-12-18 14:56:37');
INSERT INTO `user_history` VALUES ('103', null, '21', '2025-12-18 15:06:51');
INSERT INTO `user_history` VALUES ('104', null, '21', '2025-12-18 15:06:51');
INSERT INTO `user_history` VALUES ('105', null, '5', '2025-12-18 15:08:32');
INSERT INTO `user_history` VALUES ('106', null, '5', '2025-12-18 15:08:32');
INSERT INTO `user_history` VALUES ('107', null, '23', '2025-12-18 15:08:36');
INSERT INTO `user_history` VALUES ('108', null, '23', '2025-12-18 15:08:36');
INSERT INTO `user_history` VALUES ('109', null, '21', '2025-12-18 15:14:01');
INSERT INTO `user_history` VALUES ('110', null, '21', '2025-12-18 15:14:01');
INSERT INTO `user_history` VALUES ('111', null, '23', '2025-12-18 16:05:58');
INSERT INTO `user_history` VALUES ('112', null, '23', '2025-12-18 16:05:58');
INSERT INTO `user_history` VALUES ('113', null, '23', '2025-12-18 16:06:15');
INSERT INTO `user_history` VALUES ('114', null, '23', '2025-12-18 16:06:15');
INSERT INTO `user_history` VALUES ('115', null, '19', '2025-12-18 16:09:24');
INSERT INTO `user_history` VALUES ('116', null, '19', '2025-12-18 16:09:24');
INSERT INTO `user_history` VALUES ('117', null, '23', '2025-12-22 10:47:54');
INSERT INTO `user_history` VALUES ('118', null, '23', '2025-12-22 10:47:54');
INSERT INTO `user_history` VALUES ('119', null, '8', '2025-12-22 10:47:59');
INSERT INTO `user_history` VALUES ('120', null, '8', '2025-12-22 10:47:59');
INSERT INTO `user_history` VALUES ('121', null, '23', '2025-12-22 10:52:56');
INSERT INTO `user_history` VALUES ('122', null, '23', '2025-12-22 10:52:56');
INSERT INTO `user_history` VALUES ('123', null, '4', '2025-12-22 11:01:31');
INSERT INTO `user_history` VALUES ('124', null, '4', '2025-12-22 11:01:31');
