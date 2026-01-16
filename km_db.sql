/*
 Navicat Premium Data Transfer

 Source Server         : [[Localhost]]
 Source Server Type    : MariaDB
 Source Server Version : 100339 (10.3.39-MariaDB-1:10.3.39+maria~ubu2004)
 Source Host           : localhost:3306
 Source Schema         : km_db

 Target Server Type    : MariaDB
 Target Server Version : 100339 (10.3.39-MariaDB-1:10.3.39+maria~ubu2004)
 File Encoding         : 65001

 Date: 16/01/2026 09:49:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
BEGIN;
INSERT INTO `categories` (`id`, `name`, `image_url`, `created_at`) VALUES (1, 'โรคติดต่อ', 'http://localhost:5000/uploads/1765897028847-992267530.png', '2025-12-16 20:23:30');
INSERT INTO `categories` (`id`, `name`, `image_url`, `created_at`) VALUES (2, 'การส่งเสริมสุขภาพ', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');
INSERT INTO `categories` (`id`, `name`, `image_url`, `created_at`) VALUES (3, 'สุขภาพจิต', 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');
INSERT INTO `categories` (`id`, `name`, `image_url`, `created_at`) VALUES (4, 'โภชนาการ', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');
INSERT INTO `categories` (`id`, `name`, `image_url`, `created_at`) VALUES (5, 'อนามัยแม่และเด็ก', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', '2025-12-16 20:23:30');
COMMIT;

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
  CONSTRAINT `fk_item_attachments_item_id` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of item_attachments
-- ----------------------------
BEGIN;
INSERT INTO `item_attachments` (`id`, `item_id`, `file_path`, `file_type`, `original_name`, `created_at`) VALUES (1, 23, '/uploads/1765898968212-664398473.jpg', 'image/jpeg', '92812504_3155679244466284_8196405602163884032_o.jpg', '2025-12-16 22:29:28');
INSERT INTO `item_attachments` (`id`, `item_id`, `file_path`, `file_type`, `original_name`, `created_at`) VALUES (2, 23, '/uploads/1765898968221-514369503.jpg', 'image/jpeg', '92586993_3155679151132960_5174561711864152064_o.jpg', '2025-12-16 22:29:28');
COMMIT;

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
BEGIN;
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (1, 1, 'รู้จักกับโรคไข้เลือดออก', 'ไข้เลือดออกเกิดจากยุงลาย เป็นพาหะนำโรค อาการสำคัญคือไข้สูงลอย ปวดศีรษะ ปวดเมื่อยตามตัว มีจุดเลือดออกตามตัว...', 1, 14, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (2, 1, 'การป้องกัน COVID-19', 'สวมหน้ากากอนามัย ล้างมือบ่อยๆ และเว้นระยะห่างทางสังคม ยังคงเป็นมาตรการสำคัญในการป้องกันโรค...', 0, 28, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (3, 2, 'ออกกำลังกายวันละนิด จิตแจ่มใส', 'การออกกำลังกายอย่างน้อยวันละ 30 นาที ช่วยให้ร่างกายแข็งแรง ลดความเครียด และนอนหลับได้ดีขึ้น...', 1, 99, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (4, 2, '7 วิธีดูแลตัวเองฉบับพนักงานออฟฟิศ', 'เพื่อป้องกันโรคออฟฟิศซินโดรม ควรลุกเดินทุกชั่วโมง ยืดเหยียดกล้ามเนื้อ และพักสายตาจากหน้าจอคอมพิวเตอร์...', 0, 88, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (5, 3, 'เทคนิคจัดการความเครียด', 'ความเครียดสะสมส่งผลเสียต่อสุขภาพ ลองฝึกหายใจลึกๆ นั่งสมาธิ หรือหางานอดิเรกที่ชอบทำเพื่อผ่อนคลาย...', 1, 51, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (6, 3, 'สัญญาณเตือนโรคซึมเศร้า', 'หากรู้สึกเศร้า เบื่อหน่าย ท้อแท้ ไม่อยากทำอะไร ต่อเนื่องนานเกิน 2 สัปดาห์ ควรปรึกษาแพทย์...', 0, 21, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (7, 4, 'กินอาหารให้ครบ 5 หมู่', 'ร่างกายต้องการสารอาหารที่หลากหลาย ทั้งโปรตีน คาร์โบไฮเดรต ไขมัน วิตามิน และเกลือแร่ ในสัดส่วนที่เหมาะสม...', 1, 0, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (8, 4, 'ลดหวาน มัน เค็ม', 'การบริโภคน้ำตาล ไขมัน และโซเดียมมากเกินไป เป็นสาเหตุของโรคไม่ติดต่อเรื้อรัง (NCDs) เช่น เบาหวาน ความดัน...', 0, 17, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (9, 5, 'การเลี้ยงลูกด้วยนมแม่', 'นมแม่เป็นอาหารที่ดีที่สุดสำหรับทารก มีสารภูมิคุ้มกันที่ช่วยให้ลูกแข็งแรง พัฒนาการสมวัย...', 0, 24, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (10, 5, 'วัคซีนพื้นฐานสำหรับเด็ก', 'เด็กแรกเกิดถึง 12 ปี ควรได้รับวัคซีนตามเกณฑ์ของกระทรวงสาธารณสุข เพื่อป้องกันโรคติดต่อร้ายแรง...', 0, 64, '2025-12-16 20:23:30', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (19, 2, 'ทดสอบ', 'ทดสอบ', 0, 20, '2025-12-16 21:11:11', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (20, 2, 'ทดสอบ 2', 'ทดสอบ 2', 0, 28, '2025-12-16 21:16:24', NULL, 1);
INSERT INTO `items` (`id`, `category_id`, `title`, `content`, `is_highlight`, `views`, `created_at`, `attachment_url`, `is_approved`) VALUES (23, 1, 'ทดสอบ 5', 'ทดสอบ 5', 1, 154, '2025-12-16 22:29:28', '/uploads/1765898968212-664398473.jpg', 1);
COMMIT;

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
  CONSTRAINT `fk_user_history_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of user_history
-- ----------------------------
BEGIN;
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (1, NULL, 19, '2025-12-16 21:11:18');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (2, NULL, 19, '2025-12-16 21:11:18');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (3, NULL, 19, '2025-12-16 21:17:16');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (4, NULL, 19, '2025-12-16 21:17:16');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (5, NULL, 19, '2025-12-16 21:17:23');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (6, NULL, 19, '2025-12-16 21:17:23');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (7, NULL, 19, '2025-12-16 21:32:26');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (8, NULL, 19, '2025-12-16 21:32:26');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (9, NULL, 20, '2025-12-16 22:10:11');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (10, NULL, 20, '2025-12-16 22:10:11');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (17, NULL, 20, '2025-12-16 22:16:46');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (18, NULL, 20, '2025-12-16 22:16:46');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (23, NULL, 23, '2025-12-16 22:29:31');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (24, NULL, 23, '2025-12-16 22:29:31');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (27, NULL, 23, '2025-12-16 22:29:52');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (28, NULL, 23, '2025-12-16 22:29:52');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (29, NULL, 20, '2025-12-16 22:30:00');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (30, NULL, 20, '2025-12-16 22:30:00');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (33, NULL, 23, '2025-12-16 22:30:12');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (34, NULL, 23, '2025-12-16 22:30:12');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (35, NULL, 23, '2025-12-16 22:31:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (36, NULL, 23, '2025-12-16 22:31:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (37, NULL, 9, '2025-12-16 22:32:55');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (38, NULL, 9, '2025-12-16 22:32:55');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (39, NULL, 23, '2025-12-16 22:32:59');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (40, NULL, 23, '2025-12-16 22:32:59');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (41, NULL, 23, '2025-12-17 10:02:30');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (42, NULL, 23, '2025-12-17 10:02:30');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (43, NULL, 20, '2025-12-17 12:41:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (44, NULL, 20, '2025-12-17 12:41:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (45, NULL, 9, '2025-12-17 13:29:40');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (46, NULL, 9, '2025-12-17 13:29:40');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (47, NULL, 9, '2025-12-17 13:29:44');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (48, NULL, 9, '2025-12-17 13:29:44');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (49, NULL, 23, '2025-12-17 13:29:52');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (50, NULL, 23, '2025-12-17 13:29:52');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (51, NULL, 23, '2025-12-17 13:33:37');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (52, NULL, 23, '2025-12-17 13:33:37');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (53, NULL, 23, '2025-12-17 13:33:55');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (54, NULL, 23, '2025-12-17 13:33:55');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (55, NULL, 23, '2025-12-17 13:35:58');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (56, NULL, 23, '2025-12-17 13:35:58');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (57, NULL, 23, '2025-12-17 13:37:48');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (58, NULL, 23, '2025-12-17 13:37:48');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (59, NULL, 23, '2025-12-17 13:37:56');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (60, NULL, 23, '2025-12-17 13:37:56');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (63, NULL, 1, '2025-12-17 13:41:45');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (64, NULL, 1, '2025-12-17 13:41:45');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (65, NULL, 23, '2025-12-17 13:44:52');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (66, NULL, 23, '2025-12-17 13:44:52');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (67, NULL, 23, '2025-12-17 13:51:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (68, NULL, 23, '2025-12-17 13:51:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (69, NULL, 23, '2025-12-17 13:51:30');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (70, NULL, 23, '2025-12-17 13:51:30');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (71, NULL, 23, '2025-12-17 14:21:07');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (72, NULL, 23, '2025-12-17 14:21:07');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (73, NULL, 23, '2025-12-17 14:23:18');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (74, NULL, 23, '2025-12-17 14:23:18');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (75, NULL, 23, '2025-12-17 14:23:36');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (76, NULL, 23, '2025-12-17 14:23:36');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (77, NULL, 23, '2025-12-17 14:24:19');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (78, NULL, 23, '2025-12-17 14:24:19');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (79, NULL, 23, '2025-12-17 14:34:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (80, NULL, 23, '2025-12-17 14:34:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (81, NULL, 23, '2025-12-17 15:46:45');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (82, NULL, 23, '2025-12-17 15:46:45');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (83, NULL, 23, '2025-12-17 15:52:02');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (84, NULL, 23, '2025-12-17 15:52:02');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (85, NULL, 20, '2025-12-17 15:52:08');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (86, NULL, 20, '2025-12-17 15:52:08');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (87, NULL, 23, '2025-12-17 15:53:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (88, NULL, 23, '2025-12-17 15:53:03');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (89, NULL, 3, '2025-12-17 15:53:06');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (90, NULL, 3, '2025-12-17 15:53:06');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (91, NULL, 23, '2025-12-17 15:53:11');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (92, NULL, 23, '2025-12-17 15:53:11');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (93, NULL, 23, '2025-12-17 15:53:14');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (94, NULL, 23, '2025-12-17 15:53:14');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (95, NULL, 23, '2025-12-17 15:53:22');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (96, NULL, 23, '2025-12-17 15:53:22');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (97, NULL, 23, '2025-12-18 14:55:56');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (98, NULL, 23, '2025-12-18 14:55:56');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (99, NULL, 2, '2025-12-18 14:56:00');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (100, NULL, 2, '2025-12-18 14:56:00');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (101, NULL, 23, '2025-12-18 14:56:37');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (102, NULL, 23, '2025-12-18 14:56:37');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (105, NULL, 5, '2025-12-18 15:08:32');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (106, NULL, 5, '2025-12-18 15:08:32');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (107, NULL, 23, '2025-12-18 15:08:36');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (108, NULL, 23, '2025-12-18 15:08:36');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (111, NULL, 23, '2025-12-18 16:05:58');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (112, NULL, 23, '2025-12-18 16:05:58');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (113, NULL, 23, '2025-12-18 16:06:15');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (114, NULL, 23, '2025-12-18 16:06:15');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (115, NULL, 19, '2025-12-18 16:09:24');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (116, NULL, 19, '2025-12-18 16:09:24');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (117, NULL, 23, '2025-12-22 10:47:54');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (118, NULL, 23, '2025-12-22 10:47:54');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (119, NULL, 8, '2025-12-22 10:47:59');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (120, NULL, 8, '2025-12-22 10:47:59');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (121, NULL, 23, '2025-12-22 10:52:56');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (122, NULL, 23, '2025-12-22 10:52:56');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (123, NULL, 4, '2025-12-22 11:01:31');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (124, NULL, 4, '2025-12-22 11:01:31');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (125, NULL, 23, '2026-01-15 13:29:23');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (126, NULL, 23, '2026-01-15 13:29:23');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (127, NULL, 3, '2026-01-15 13:29:28');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (128, NULL, 3, '2026-01-15 13:29:28');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (129, NULL, 4, '2026-01-15 13:29:31');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (130, NULL, 4, '2026-01-15 13:29:31');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (131, NULL, 23, '2026-01-15 13:29:34');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (132, NULL, 23, '2026-01-15 13:29:34');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (133, NULL, 20, '2026-01-15 14:21:16');
INSERT INTO `user_history` (`id`, `user_id`, `item_id`, `accessed_at`) VALUES (134, NULL, 20, '2026-01-15 14:21:16');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT '',
  `email` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` datetime DEFAULT current_timestamp(),
  `display_name` varchar(255) DEFAULT NULL,
  `provider_profile` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_approved` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `username`, `password`, `email`, `department`, `role`, `created_at`, `display_name`, `provider_profile`, `updated_at`, `is_approved`) VALUES (12, '0716DD2D22996', '', 'mr.panupong.do@one.th', 'สำนักงานสาธารณสุขจังหวัดพิษณุโลก', 'admin', '2026-01-15 13:22:53', 'ภาณุพงษ์ ดงเย็น', '{\"account_id\":\"1365442746417063\",\"hash_cid\":\"96e34dc86ee18d2d04dda709e644d729d58781496ca17c84fc284dff3043dc48\",\"provider_id\":\"0716DD2D22996\",\"title_th\":\"นาย\",\"special_title_th\":\"อื่นๆ\",\"name_th\":\"ภาณุพงษ์ ดงเย็น\",\"name_eng\":\"MR.PANUPONG DONGYEN\",\"created_at\":\"2024-04-30T02:55:04.000Z\",\"title_en\":\"MR.\",\"special_title_en\":\"Other\",\"firstname_th\":\"ภาณุพงษ์\",\"lastname_th\":\"ดงเย็น\",\"firstname_en\":\"MR.PANUPONG\",\"lastname_en\":\"DONGYEN\",\"email\":\"mr.panupong.do@one.th\",\"date_of_birth\":\"1991-02-12\",\"organization\":[{\"business_id\":\"4357501332484360\",\"position\":\"แพทย์\",\"position_id\":\"0001\",\"affiliation\":\"แพทย์\",\"license_id\":\"\",\"hcode\":\"00051\",\"code9\":\"000005100\",\"hcode9\":\"AA0000051\",\"level\":\"3\",\"hname_th\":\"สำนักงานสาธารณสุขจังหวัดพิษณุโลก\",\"hname_eng\":\"Provincial Public Health Office\",\"tax_id\":\"2885556200792\",\"license_expired_date\":null,\"license_id_verify\":false,\"expertise\":null,\"expertise_id\":null,\"moph_station_ref_code\":null,\"is_private_provider\":false,\"address\":{\"address\":null,\"moo\":null,\"building\":null,\"soi\":null,\"street\":null,\"province\":\"พิษณุโลก\",\"district\":\"เมืองพิษณุโลก\",\"sub_district\":\"ในเมือง\",\"zip_code\":\"65000\"},\"position_type\":\"แพทย์\"}]}', '2026-01-15 14:19:24', 1);
INSERT INTO `users` (`id`, `username`, `password`, `email`, `department`, `role`, `created_at`, `display_name`, `provider_profile`, `updated_at`, `is_approved`) VALUES (13, '07184C7D60DCB', '', 'mineru.nan@gmail.com', 'สำนักงานสาธารณสุขจังหวัดพิษณุโลก', 'admin', '2026-01-15 14:20:17', 'ชวิศ วัฒนกุลชัย', '{\"account_id\":\"10958765030411110\",\"hash_cid\":\"09e68f85cc3a317c3ce3ca684d95dc345092ea9c29945ce421b357e53d811cc5\",\"provider_id\":\"07184C7D60DCB\",\"title_th\":\"นาย\",\"special_title_th\":\"อื่นๆ\",\"name_th\":\"ชวิศ วัฒนกุลชัย\",\"name_eng\":\"chawit wattanakulchai\",\"created_at\":\"2024-04-05T08:54:56.000Z\",\"title_en\":null,\"special_title_en\":\"Other\",\"firstname_th\":\"ชวิศ\",\"lastname_th\":\"วัฒนกุลชัย\",\"firstname_en\":\"chawit\",\"lastname_en\":\"wattanakulchai\",\"email\":\"mineru.nan@gmail.com\",\"date_of_birth\":\"1984-04-19\",\"organization\":[{\"business_id\":\"4357501332484360\",\"position\":\"นักวิชาการคอมพิวเตอร์\",\"position_id\":\"0007\",\"affiliation\":\"นักวิชาการคอมพิวเตอร์\",\"license_id\":null,\"hcode\":\"00051\",\"code9\":\"000005100\",\"hcode9\":\"AA0000051\",\"level\":\"3\",\"hname_th\":\"สำนักงานสาธารณสุขจังหวัดพิษณุโลก\",\"hname_eng\":\"Provincial Public Health Office\",\"tax_id\":\"2885556200792\",\"license_expired_date\":null,\"license_id_verify\":false,\"expertise\":null,\"expertise_id\":null,\"moph_station_ref_code\":null,\"is_private_provider\":false,\"address\":{\"address\":null,\"moo\":null,\"building\":null,\"soi\":null,\"street\":null,\"province\":\"พิษณุโลก\",\"district\":\"เมืองพิษณุโลก\",\"sub_district\":\"ในเมือง\",\"zip_code\":\"65000\"},\"position_type\":\"นักวิชาการคอมพิวเตอร์\"}]}', '2026-01-15 14:28:03', 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
