-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.22-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for mkd
DROP DATABASE IF EXISTS `mkd`;
CREATE DATABASE IF NOT EXISTS `mkd` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `mkd`;

-- Dumping structure for table mkd.active
DROP TABLE IF EXISTS `active`;
CREATE TABLE IF NOT EXISTS `active` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `handle` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `variables_scores` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.active: ~26 rows (approximately)
DELETE FROM `active`;
/*!40000 ALTER TABLE `active` DISABLE KEYS */;
INSERT INTO `active` (`id`, `name`, `handle`, `description`, `variables_scores`, `created_at`, `updated_at`) VALUES
	(1, 'Acai', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"70","Hydration":"70","Breakouts":"","Color":"","Sun":"90","Hyperpigmentation":"50","Hypopigmentation":"","Redness":"90","Lines":"90","Firmness":"90","Pores":"20","Blackheads":"10","Allergies":"","Pollution":"70","Temperature":"","Stress":"70","Diet":"","Sleep":"20","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(2, 'Bakuchiol', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"0","Breakouts":"100","Color":"","Sun":"100","Hyperpigmentation":"100","Hypopigmentation":"","Redness":"90","Lines":"100","Firmness":"100","Pores":"50","Blackheads":"80","Allergies":"","Pollution":"0","Temperature":"","Stress":"0","Diet":"","Sleep":"80","Blue Light":"","Oxygenation":"80"}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(3, 'Base', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(4, 'Base Refill', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(5, 'Chamomile', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"90","Hydration":"90","Breakouts":"70","Color":"","Sun":"90","Hyperpigmentation":"70","Hypopigmentation":"","Redness":"100","Lines":"90","Firmness":"90","Pores":"40","Blackheads":"50","Allergies":"","Pollution":"80","Temperature":"","Stress":"10","Diet":"","Sleep":"40","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(6, 'Chia', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"90","Hydration":"70","Breakouts":"100","Color":"","Sun":"90","Hyperpigmentation":"70","Hypopigmentation":"","Redness":"20","Lines":"60","Firmness":"40","Pores":"80","Blackheads":"100","Allergies":"","Pollution":"50","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(7, 'Coconut', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"100","Breakouts":"30","Color":"","Sun":"90","Hyperpigmentation":"20","Hypopigmentation":"","Redness":"70","Lines":"40","Firmness":"40","Pores":"20","Blackheads":"0","Allergies":"","Pollution":"80","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(8, 'Cogon Grass', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"40","Hydration":"100","Breakouts":"20","Color":"","Sun":"90","Hyperpigmentation":"40","Hypopigmentation":"","Redness":"10","Lines":"80","Firmness":"80","Pores":"20","Blackheads":"10","Allergies":"","Pollution":"10","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(9, 'Cucumber', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"100","Breakouts":"60","Color":"","Sun":"90","Hyperpigmentation":"20","Hypopigmentation":"","Redness":"80","Lines":"60","Firmness":"60","Pores":"50","Blackheads":"20","Allergies":"","Pollution":"40","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(10, 'Dragon\'s Blood', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"80","Breakouts":"70","Color":"","Sun":"90","Hyperpigmentation":"50","Hypopigmentation":"","Redness":"80","Lines":"100","Firmness":"100","Pores":"20","Blackheads":"20","Allergies":"","Pollution":"80","Temperature":"","Stress":"80","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(11, 'Ginseng', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"10","Breakouts":"30","Color":"","Sun":"100","Hyperpigmentation":"50","Hypopigmentation":"","Redness":"70","Lines":"100","Firmness":"100","Pores":"10","Blackheads":"10","Allergies":"","Pollution":"90","Temperature":"","Stress":"10","Diet":"","Sleep":"20","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(12, 'Gotu Kola', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"90","Hydration":"80","Breakouts":"60","Color":"","Sun":"90","Hyperpigmentation":"60","Hypopigmentation":"","Redness":"90","Lines":"70","Firmness":"70","Pores":"60","Blackheads":"20","Allergies":"","Pollution":"70","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(13, 'Licorice Root', NULL, NULL, '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"0","Hydration":"0","Breakouts":"10","Color":"","Sun":"40","Hyperpigmentation":"100","Hypopigmentation":"","Redness":"90","Lines":"60","Firmness":"20","Pores":"10","Blackheads":"10","Allergies":"","Pollution":"30","Temperature":"","Stress":"10","Diet":"","Sleep":"70","Blue Light":"","Oxygenation":""}', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(14, 'Moringa', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(15, 'Moth Bean', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(16, 'Mushrooms', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(17, 'Oatmeal', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(18, 'Okra', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(19, 'Olive Squalane', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(20, 'Red Raddish', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(21, 'Rose Hip', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(22, 'Sake Extract', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(23, 'Sandalwood', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(24, 'Tonka Bean', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(25, 'White Willow Bark', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(26, 'Yeast Extract', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44');
/*!40000 ALTER TABLE `active` ENABLE KEYS */;

-- Dumping structure for table mkd.activity_log
DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `data` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.activity_log: ~0 rows (approximately)
DELETE FROM `activity_log`;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;

-- Dumping structure for table mkd.admin_operation
DROP TABLE IF EXISTS `admin_operation`;
CREATE TABLE IF NOT EXISTS `admin_operation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `detail` text DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.admin_operation: ~0 rows (approximately)
DELETE FROM `admin_operation`;
/*!40000 ALTER TABLE `admin_operation` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_operation` ENABLE KEYS */;

-- Dumping structure for table mkd.answer
DROP TABLE IF EXISTS `answer`;
CREATE TABLE IF NOT EXISTS `answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `answer_value` float DEFAULT NULL,
  `hide_answer` tinyint(1) DEFAULT NULL,
  `explaination` text DEFAULT NULL,
  `image_id` text DEFAULT NULL,
  `response_header` text DEFAULT NULL,
  `response_body` text DEFAULT NULL,
  `response_arguments` text DEFAULT NULL,
  `black_list_actives` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.answer: ~96 rows (approximately)
DELETE FROM `answer`;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` (`id`, `question_id`, `order`, `answer`, `answer_value`, `hide_answer`, `explaination`, `image_id`, `response_header`, `response_body`, `response_arguments`, `black_list_actives`, `created_at`, `updated_at`) VALUES
	(1, 1, 1, NULL, NULL, NULL, NULL, NULL, '<<<name>>>', NULL, '["name"]', NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(2, 2, 1, '<25', NULL, NULL, NULL, NULL, NULL, 'We will focus on actives that will improving your skin health and appearance without adding anything unnecessary.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(3, 2, 2, '25-40', NULL, NULL, NULL, NULL, NULL, 'We will create a custom formula containing actives to ensure we maintain your optimal skin health and appearance. We will spoil you with some wonderful actives that will help delay visible signs of skin aging.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(4, 2, 3, '>40', NULL, NULL, NULL, NULL, NULL, 'We have so many luxurious actives that will work to address any of the desires that come with time and knowledge.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(5, 3, 1, 'Female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(6, 3, 2, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(7, 3, 3, 'Non-binary', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(8, 3, 4, 'Other', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(9, 4, 1, 'Yes', 100, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(10, 4, 2, 'No', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(11, 5, 1, 'Beard', 100, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(12, 5, 2, 'Stubble', 66, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(13, 5, 3, 'Clean', 33, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(14, 5, 4, 'Shaven', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(15, 6, 1, 'It\'s not', NULL, NULL, NULL, '2', 'Wonderful!', 'We can now eliminate many active ingredients that are just suited for sensitive skin and focus on just the wonderful actives that will perform other wonderful functions! Don’t worry we won’t be adding anything that can or will lead to extra sensitivity.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(16, 6, 2, 'Moderately', NULL, NULL, NULL, '3', 'Noted.', 'We have many wonderful ingredients that are specifically proven to be soothing even for mildly sensitive skin. We will add these along with other functional actives that are non-sensitizing.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(17, 6, 3, 'Extremely', NULL, NULL, NULL, '4', 'Noted.', 'We have many wonderful ingredients that are specifically proven to be soothing for sensitive skin. We will add these along with other functional actives that are non-sensitizing.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(18, 7, 1, 'Very Dry', NULL, NULL, NULL, '5', 'Let’s hydrate!', 'We will add some wonderful hydrating actives that will specifically address your dry skin needs (some of the later questions will help us determine exactly which of our hydrating actives are perfect for you based on their scientific mode of action)', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(19, 7, 2, 'Normal / Combination', NULL, NULL, NULL, '6', 'We know the feeling!', 'We have some wonderful ingredients that will maintain optimal skin hydration while controlling excess oil production.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(20, 7, 3, 'Very Oily', NULL, NULL, NULL, '7', 'Ok! We’ll balance that out.', 'We will make sure to add actives that will help control excess skin oiliness, while still addressing all your other skin needs.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(21, 8, 1, 'Hardly', NULL, NULL, NULL, NULL, 'Great!', 'We will now just focus on those actives you need', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(22, 8, 2, 'Sometimes', NULL, NULL, NULL, NULL, 'Great!', 'We\'ll make sure not to add any actives that may lead to breakouts in breakout-prone skin', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(23, 8, 3, 'Always', NULL, NULL, NULL, NULL, 'Noted.', 'We will add some of our amazing oil-control actives to alleviate some of the factors that can aggravate breakout prone skin. (Note: due to the personalized nature of our system we cannot make any claims to treat or prevent acne in accordance with FDA regulations.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(24, 9, 1, '15', 100, NULL, NULL, '8', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(25, 9, 2, '14', 93.3333, NULL, NULL, '9', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(26, 9, 3, '13', 86.6667, NULL, NULL, '10', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(27, 9, 4, '12', 80, NULL, NULL, '11', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(28, 9, 5, '11', 73.3333, NULL, NULL, '12', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(29, 9, 6, '10', 66.6667, NULL, NULL, '13', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(30, 9, 7, '9', 60, NULL, NULL, '14', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(31, 9, 8, '8', 53.3333, NULL, NULL, '15', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(32, 9, 9, '7', 46.6667, NULL, NULL, '16', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(33, 9, 10, '6', 40, NULL, NULL, '17', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(34, 9, 11, '5', 33.3333, NULL, NULL, '18', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(35, 9, 12, '4', 26.6667, NULL, NULL, '19', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(36, 9, 13, '3', 20, NULL, NULL, '20', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(37, 9, 14, '2', 13.3333, NULL, NULL, '21', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(38, 9, 15, '1', 6.66667, NULL, NULL, '22', NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(39, 10, 1, 'Never', NULL, NULL, NULL, NULL, NULL, 'Keep the sunscreen close! We’ll make sure to add some wonderful actives that will help you with your beautiful glow', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(40, 10, 2, 'Sometimes', NULL, NULL, NULL, NULL, NULL, 'Don’t forget the sunscreen! We’ll make sure to add some wonderful actives that will help you with your beautiful glow', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(41, 10, 3, 'Always', NULL, NULL, NULL, NULL, NULL, 'We’ll make sure to add some wonderful actives that will help you with your beautiful glow.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(42, 11, 2, 'Yes', NULL, NULL, NULL, NULL, NULL, 'We’ll add some of our wonderful actives that will minimize the appearance of any hyper or hypo-pigmentation.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(43, 11, 1, 'No', NULL, NULL, NULL, NULL, NULL, 'Great, we can eliminate the addition of unnecessary actives and only focus on those that you need.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(44, 12, 3, 'Instant Burn', NULL, NULL, NULL, NULL, 'We hear your pain!', 'Make sure to wear proper SPF and we’ll make sure we add actives that are not sun-sensitizing.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(45, 12, 2, 'Middle', NULL, NULL, NULL, NULL, 'Noted.', 'Make sure to wear proper SPF and we’ll make sure we add actives that will not make your skin extra sensitive to the sun during the day.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(46, 12, 1, 'Hardly ever', NULL, NULL, NULL, NULL, 'Lucky!', 'We can focus on all the great actives your skin needs without the sun’s distraction – though we still recommend using a daily SPF.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(47, 13, 1, 'Red? Huh? No red here', NULL, NULL, NULL, '23', 'Great!', 'We’ll just focus on the actives that you need.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(48, 13, 2, 'Occaisonally red & blotchy.', NULL, NULL, NULL, '24', 'Noted.', 'We have amazing actives specifically for redness – keep going till the end to find out what we have chosen specifically for your needs.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(49, 13, 3, 'I am constantly seeing red', NULL, NULL, NULL, '24', 'Noted.', 'We have amazing actives specifically for redness – keep going till the end to find out what we have chosen specifically for your needs.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(50, 15, 1, 'No Wrinkles/Lines', NULL, NULL, NULL, '25', 'Amazing <<<name>>>,', 'We have some amazing anti-wrinkle actives, most with more than ten letters, and you don’t need any of them. Save your money to splurge on things that will actually do something for you.', '["name"]', NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(51, 15, 2, 'A Few Lines', NULL, 1, NULL, '26', NULL, 'We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(52, 15, 3, 'A Few Lines Observable at all times', NULL, 1, NULL, '27', NULL, 'We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(53, 15, 4, 'Some Lines', NULL, NULL, NULL, '28', NULL, 'We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(54, 15, 5, 'Lines Plus Hints of Wrinkles', NULL, 1, NULL, '29', NULL, 'We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(55, 15, 6, 'A Few Wrinkles', NULL, 1, NULL, '30', 'We’re going to add some of our luxurious anti-wrinkle actives. Keep going till the end to see what we recommend.', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(56, 15, 7, 'Lots of Wrinkles', NULL, NULL, NULL, '31', 'We’re going to add some of our luxurious anti-wrinkle actives. Keep going till the end to see what we recommend.', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(57, 16, 1, 'Firm as a baby', NULL, NULL, NULL, NULL, 'Amazing!!', 'We’ll focus on the actives more appropriate to your skin and ensure we maintain your skin’s natural resilience.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(58, 16, 2, 'Middle', NULL, NULL, NULL, NULL, NULL, 'We’ll add some luxurious actives to your formulation that will help prevent and improve your skins firmness.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(59, 16, 3, 'Sagging', NULL, NULL, NULL, NULL, 'We got you!', 'We’ll add some of our wonderful actives that will improve your skin’s appearance of firmness.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(60, 17, 1, 'No - smooth as can be', NULL, NULL, NULL, NULL, 'Lucky you!', 'We can eliminate actives that will just be extra clutter for your wonderful skin.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(61, 17, 2, 'Some', NULL, NULL, NULL, NULL, NULL, 'We’ll keep this in mind (our algorithm’s mind) as we create your perfect formula.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(62, 17, 3, 'A lot', NULL, NULL, NULL, NULL, NULL, 'We’ll keep this in mind (our algorithm’s mind) as we create your perfect formula.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(63, 18, 1, 'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(64, 18, 2, 'Some', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(65, 18, 3, 'A lot', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(66, 19, 1, 'Yes', 100, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(67, 19, 2, 'No', 0, NULL, NULL, NULL, 'Lucky You!', NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(68, 20, 1, 'Banana', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(69, 20, 2, 'Olive', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(70, 20, 3, 'Sunflowers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(71, 22, 1, 'Never', NULL, NULL, NULL, NULL, 'Great!', 'This means your skin is exposed to less pollution and better oxygenation!', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(72, 22, 2, 'Sometimes', NULL, NULL, NULL, NULL, NULL, 'We’ll make sure to add extra actives to address the pollution your skin is exposed to.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(73, 22, 3, 'Multiple per day', NULL, NULL, NULL, NULL, 'Got it.', 'Your formula will include actives for anti-pollution and increased oxygenation to your skin.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(74, 23, 1, 'Cool as a cucumber', NULL, NULL, NULL, NULL, 'Lucky you!', 'We’ll rather focus on areas that are of greater concern to you.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(75, 23, 2, 'Sometimes', NULL, NULL, NULL, NULL, NULL, 'Occasional stress can release cortisol and other factors that can negatively affect the skin. We’ll add some adaptogens and other actives that can help mitigate some of these effects.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(76, 23, 3, 'In a constant state of anxiety', NULL, NULL, NULL, NULL, NULL, 'Stress can release cortisol and other factors that can negatively affect the skin. We’ll add some adaptogens and other actives that can help mitigate some of these effects.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(77, 24, 1, 'Vegan/Vegetarian', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(78, 24, 2, 'Flexitarian, I sometime eat meat', 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(79, 24, 3, 'Pescatarian, I’ll have fish and seafood, but no meat', 50, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(80, 24, 4, 'I stay away from red meat', 75, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(81, 24, 5, 'I eat everything', 100, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(82, 25, 1, '<4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(83, 25, 2, '5-7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(84, 25, 3, '8+', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(85, 26, 1, '0-2', NULL, NULL, NULL, NULL, 'Good for you!', 'Blue light emitted from screens can be harmful to your skin’s health and appearance. Your low exposure means we can rather focus on other areas to optimize your skin health and appearance.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(86, 26, 2, '2-6', NULL, NULL, NULL, NULL, NULL, 'Blue light emitted from screens can be harmful to your skin’s health and appearance. No worries though, we’ll add some actives, such as our innovative Rockrose extract that will help mitigate some of these effects.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(87, 26, 3, '6+', NULL, NULL, NULL, NULL, NULL, 'Blue light emitted from screens can affect your skin’s circadian rhythm as well as affect your skin’s health and appearance. We’ll add some actives, such as our innovative Rockrose extract that will help mitigate some of these effect', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(88, 27, 1, '0', NULL, NULL, NULL, '32', NULL, 'We’ll add extra hydrating actives, but we recommend you drink more so your skin gets nourished from within as well.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(89, 27, 2, '4', NULL, NULL, NULL, '33', NULL, 'We’ll add extra hydrating actives, but we recommend you drink more so your skin gets nourished from within as well.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(90, 27, 3, '8+', NULL, NULL, NULL, '34', 'Great!', 'You don’t need extra actives to compensate from a lack of internal hydration.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(91, 28, 1, 'None', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(92, 28, 2, 'Full Coverage', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(93, 29, 1, 'Low', NULL, NULL, NULL, NULL, NULL, 'We’ll add extra actives to give your skin an extra boost on oxygenation and nutrient delivery.', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(94, 29, 2, 'High', NULL, NULL, NULL, NULL, 'Great!', 'By exercising you are providing extra oxygenation and nutrient delivery to your skin, so we don’t have to add extra actives to do what you are already doing an even better job at. ', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(95, 30, 1, 'No', NULL, 0, NULL, NULL, 'Great!', 'We can eliminate the addition of unnecessary actives and only focus on those that you need. ', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(96, 30, 1, 'Yes', NULL, 0, NULL, NULL, NULL, 'We\'ll add some of our wonderful actives that will minimize the appearance of hypopigmentation over time', NULL, NULL, '2022-04-10 11:07:44', '2022-04-10 11:07:44');
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;

-- Dumping structure for table mkd.configuration
DROP TABLE IF EXISTS `configuration`;
CREATE TABLE IF NOT EXISTS `configuration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.configuration: ~1 rows (approximately)
DELETE FROM `configuration`;
/*!40000 ALTER TABLE `configuration` DISABLE KEYS */;
INSERT INTO `configuration` (`id`, `image_id`, `created_at`, `updated_at`) VALUES
	(1, 35, '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `configuration` ENABLE KEYS */;

-- Dumping structure for table mkd.credential
DROP TABLE IF EXISTS `credential`;
CREATE TABLE IF NOT EXISTS `credential` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `oauth` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `verify` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `two_factor_authentication` int(11) DEFAULT NULL,
  `force_password_change` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.credential: ~2 rows (approximately)
DELETE FROM `credential`;
/*!40000 ALTER TABLE `credential` DISABLE KEYS */;
INSERT INTO `credential` (`id`, `oauth`, `email`, `password`, `user_id`, `type`, `verify`, `status`, `two_factor_authentication`, `force_password_change`, `created_at`, `updated_at`) VALUES
	(1, NULL, 'admin@manaknight.com', '$2a$04$tQm/w6gJNKOoiZOn0WVISe1xG7BD1ulw72UNHXsXgLObtdKjlMhZK', 1, 0, 1, 1, 0, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, NULL, 'member@manaknight.com', '$2a$04$A7JX0xG2Gwt06UKpxq/Yd.oJARP6.BpzkzjOhc67.2dkfqjJPJ0pe', 2, 0, 1, 1, 0, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `credential` ENABLE KEYS */;

-- Dumping structure for table mkd.email
DROP TABLE IF EXISTS `email`;
CREATE TABLE IF NOT EXISTS `email` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `subject` text DEFAULT NULL,
  `tag` text DEFAULT NULL,
  `html` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.email: ~4 rows (approximately)
DELETE FROM `email`;
/*!40000 ALTER TABLE `email` DISABLE KEYS */;
INSERT INTO `email` (`id`, `slug`, `subject`, `tag`, `html`, `created_at`, `updated_at`) VALUES
	(1, 'reset-password', 'Reset your password', 'email,reset_token,link', 'Hi {{{email}}},<br/>You have requested to reset your password. Please click the link below to reset it.<br/><a href="{{{link}}}/{{{reset_token}}}">Link</a>. <br/>Thanks,<br/> Admin', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, 'register', 'Register', 'email', 'Hi {{{email}}},<br/>Thanks for registering on our platform. <br/>Thanks,<br/> Admin', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(3, 'confirm-password', 'Confirm your account', 'email,confirm_token,link', 'Hi {{{email}}},<br/>Please click the link below to confirm your account.<br/><a href="{{{link}}}/{{{confirm_token}}}">Link</a>Thanks,<br/> Admin', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(4, 'verify', 'Account verification', 'code', 'Your verification # is {{{code}}}', '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `email` ENABLE KEYS */;

-- Dumping structure for table mkd.image
DROP TABLE IF EXISTS `image`;
CREATE TABLE IF NOT EXISTS `image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` text DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `mobile_width` int(11) DEFAULT NULL,
  `mobile_height` int(11) DEFAULT NULL,
  `upload_type` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.image: ~35 rows (approximately)
DELETE FROM `image`;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` (`id`, `url`, `caption`, `user_id`, `width`, `height`, `mobile_width`, `mobile_height`, `upload_type`, `created_at`, `updated_at`) VALUES
	(1, '/image/profile.png', '', 1, 581, 581, 348, 348, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, '/frontend_images/Icons/SVG/Skin Sensitivity/Non Sensitive Skin.svg', '', 1, 183, 183, 183, 183, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(3, '/frontend_images/Icons/SVG/Skin Sensitivity/Moderately Sensitive.svg', '', 1, 183, 183, 183, 183, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(4, '/frontend_images/Icons/SVG/Skin Sensitivity/Extremely Sensitive.svg', '', 1, 183, 183, 183, 183, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(5, '/frontend_images/Icons/SVG/Dry_Oily Skin/Dry Skin.svg', '', 1, 191, 191, 191, 191, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(6, '/frontend_images/Icons/SVG/Dry_Oily Skin/Normal and Combination.svg', '', 1, 191, 191, 191, 191, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(7, '/frontend_images/Icons/SVG/Dry_Oily Skin/Oily.svg', '', 1, 191, 191, 191, 191, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(8, '/frontend_images/SkintoneGraphics/1.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(9, '/frontend_images/SkintoneGraphics/2.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(10, '/frontend_images/SkintoneGraphics/3.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(11, '/frontend_images/SkintoneGraphics/4.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(12, '/frontend_images/SkintoneGraphics/5.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(13, '/frontend_images/SkintoneGraphics/6.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(14, '/frontend_images/SkintoneGraphics/7.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(15, '/frontend_images/SkintoneGraphics/8.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(16, '/frontend_images/SkintoneGraphics/9.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(17, '/frontend_images/SkintoneGraphics/10.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(18, '/frontend_images/SkintoneGraphics/11.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(19, '/frontend_images/SkintoneGraphics/12.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(20, '/frontend_images/SkintoneGraphics/13.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(21, '/frontend_images/SkintoneGraphics/14.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(22, '/frontend_images/SkintoneGraphics/15.png', '', 1, 74, 135, 74, 135, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(23, '/frontend_images/Icons/SVG/Blotchiness/No Blotchiness.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(24, '/frontend_images/Icons/PNG/Blotchiness/Lot\'s of Blotchiness.png', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(25, '/frontend_images/Icons/SVG/Face Lines/No Wrinkles.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(26, '/frontend_images/Icons/SVG/Face Lines/A Few Lines.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(27, '/frontend_images/Icons/SVG/Face Lines/A Few Lines Observable at all times.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(28, '/frontend_images/Icons/SVG/Face Lines/Some Lines.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(29, '/frontend_images/Icons/SVG/Face Lines/Lines Plus Hints of Wrinkles.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(30, '/frontend_images/Icons/SVG/Face Lines/A Few Wrinkles.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(31, '/frontend_images/Icons/SVG/Face Lines/Lots of Wrinkles.svg', '', 1, 240, 240, 240, 240, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(32, '/frontend_images/Icons/SVG/Water/1 Glass of Water.svg', '', 1, 140, 190, 140, 190, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(33, '/frontend_images/Icons/SVG/Water/4 Glasses of Water.svg', '', 1, 140, 190, 140, 190, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(34, '/frontend_images/Icons/SVG/Water/8 Glasses of Water.svg', '', 1, 140, 190, 140, 190, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(35, '/frontend_images/MainImage/main_quiz_image.png', NULL, 1, NULL, NULL, NULL, NULL, NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `image` ENABLE KEYS */;

-- Dumping structure for table mkd.member_operation
DROP TABLE IF EXISTS `member_operation`;
CREATE TABLE IF NOT EXISTS `member_operation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) DEFAULT NULL,
  `detail` text DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.member_operation: ~0 rows (approximately)
DELETE FROM `member_operation`;
/*!40000 ALTER TABLE `member_operation` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_operation` ENABLE KEYS */;

-- Dumping structure for table mkd.order
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `webhook_id` varchar(255) DEFAULT NULL,
  `shopify_id` varchar(255) DEFAULT NULL,
  `event` text DEFAULT NULL,
  `customer_shopify_id` varchar(255) DEFAULT NULL,
  `customer` text DEFAULT NULL,
  `answers` text DEFAULT NULL,
  `profile` text DEFAULT NULL,
  `actives` text DEFAULT NULL,
  `items` text DEFAULT NULL,
  `financial_status` varchar(255) DEFAULT NULL,
  `fulfillment_status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `webhook_id` (`webhook_id`),
  UNIQUE KEY `shopify_id` (`shopify_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.order: ~0 rows (approximately)
DELETE FROM `order`;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

-- Dumping structure for table mkd.output_variable
DROP TABLE IF EXISTS `output_variable`;
CREATE TABLE IF NOT EXISTS `output_variable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `priority` float DEFAULT NULL,
  `active_list` text DEFAULT NULL,
  `ranges_response` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.output_variable: ~25 rows (approximately)
DELETE FROM `output_variable`;
/*!40000 ALTER TABLE `output_variable` DISABLE KEYS */;
INSERT INTO `output_variable` (`id`, `name`, `priority`, `active_list`, `ranges_response`, `created_at`, `updated_at`) VALUES
	(1, 'Bio Age', 0, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, 'Age', 70, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(3, 'Gender', 75, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(4, 'Pregnancy', 100, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(5, 'Hair', 75, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(6, 'Sensitivity', 90, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(7, 'Hydration', 100, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(8, 'Breakouts', 100, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(9, 'Color', 50, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(10, 'Sun', 95, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(11, 'Hyperpigmentation', 90, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(12, 'Hypopigmentation', 90, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(13, 'Redness', 85, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(14, 'Lines', 100, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(15, 'Firmness', 100, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(16, 'Pores', 70, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(17, 'Blackheads', 65, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(18, 'Allergies', 100, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(19, 'Pollution', 80, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(20, 'Temperature', 0, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(21, 'Stress', 40, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(22, 'Diet', 30, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(23, 'Sleep', 20, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(24, 'Blue Light', 45, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(25, 'Oxygenation', 40, NULL, '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]', '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `output_variable` ENABLE KEYS */;

-- Dumping structure for table mkd.question
DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `question_arguments` text DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `image_width` float DEFAULT NULL,
  `image_height` float DEFAULT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `note_type` int(11) DEFAULT NULL,
  `target` int(11) DEFAULT NULL,
  `response` text DEFAULT NULL,
  `save_response_into` varchar(255) DEFAULT NULL,
  `depends_on` varchar(255) DEFAULT NULL,
  `slider_range` varchar(255) DEFAULT NULL,
  `output_variable_name` varchar(255) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `extra_output_variable` text DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.question: ~30 rows (approximately)
DELETE FROM `question`;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` (`id`, `quiz_id`, `question`, `question_arguments`, `order`, `image_width`, `image_height`, `placeholder`, `note`, `note_type`, `target`, `response`, `save_response_into`, `depends_on`, `slider_range`, `output_variable_name`, `weight`, `extra_output_variable`, `type`, `created_at`, `updated_at`) VALUES
	(1, 1, 'What would you like to be called?', NULL, 1, NULL, NULL, 'name', NULL, NULL, 4, NULL, 'name', NULL, NULL, NULL, NULL, NULL, 1, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, 1, ' When were you born <<<name>>>?', '["name"]', 2, NULL, NULL, 'year', 'Your age plays an important role on which functional actives we may want to focus on for your skin assessment.', 2, 4, NULL, 'age', NULL, NULL, 'Bio Age', 100, '[{"name":"Age","weight":50}]', 3, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(3, 1, 'What is your hormonal gender', NULL, 3, NULL, NULL, NULL, 'Your hormones play an important role in your skin’s health and appearance.', 1, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(4, 1, 'Are you pregnant or breastfeeding?', NULL, 4, NULL, NULL, NULL, 'Hormonal changes during pregnancy can lead to visible changes in skin appearance. It’s also very important to ensure that all actives are proven safe for this important period.', 2, 1, NULL, NULL, '3|female', NULL, 'Pregnancy', 100, NULL, 4, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(5, 1, 'What is your facial hair situation?', NULL, 5, NULL, NULL, NULL, 'Presence of hair on face can have an effect on the skin beneath.', 2, 2, NULL, NULL, '3|male', NULL, 'Hair', 100, NULL, 4, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(6, 2, 'How Sensitive is your skin?', NULL, 1, NULL, NULL, NULL, 'We’ll be more careful of which actives we add to formula for those with more sensitive skin types. It’s all about balancing effectivity, complexity and leaving you feeling your best.', 2, 4, NULL, NULL, NULL, '0-100', 'Sensitivity', 100, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(7, 2, 'How would you describe your skin on an average day?', NULL, 2, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Hydration', 70, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(8, 2, 'How often do you have breakouts, such as an occasional pimple or frequent breakouts (such as chronic acne)?', NULL, 3, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Breakouts', 100, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(9, 2, 'What’s your skintone without a suntan?', NULL, 4, 60, 110, NULL, 'Different skin tones are associated with different levels of skin melanin, leading to differing reactions of skin to the effects of the sun.', 2, 4, NULL, NULL, NULL, NULL, 'Color', 100, '[{"name":"Sun","weight":10},{"name":"Hyperpigmentation","weight":10}]', 5, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(10, 2, 'How easily does your skin tan?', NULL, 5, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Sun', 20, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(11, 2, 'Is your skin prone to Hyperpigmentation?', NULL, 6, NULL, NULL, NULL, 'This is the likelihood of skin discoloring associated with aging or after injury.', 1, 4, NULL, NULL, NULL, '0-100', 'Hyperpigmentation', 90, '[{"name":"Sun","weight":10}]', 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(12, 2, 'How easily does your skin burn in the sun?', NULL, 8, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Sun', 60, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(13, 2, 'How often does your skin experience redness?', NULL, 9, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Redness', 100, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(14, 2, 'Halfway There! Do you want to save your progress?', NULL, 10, NULL, NULL, 'email', NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(15, 2, 'Which best describes your face?', NULL, 11, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Lines', 100, '[{"name":"Age","weight":30}]', 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(16, 2, 'How firm is your skin?', NULL, 12, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Firmness', 100, '[{"name":"Age","weight":20}]', 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(17, 2, 'Do you have enlarged pores?', NULL, 13, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Pores', 100, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(18, 2, 'Do you have blackheads?', NULL, 14, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Blackheads', 100, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(19, 2, 'Do you have any known allergies?', NULL, 15, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, 'Allergies', 100, NULL, 4, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(20, 2, 'Do you know if you have allergies to any of the following?', NULL, 16, NULL, NULL, NULL, NULL, NULL, 4, 'We’ll make sure to leave those out', NULL, '19|yes', NULL, NULL, NULL, NULL, 7, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(21, 3, 'Let’s adjust your cream to your geography. Enter your city below', NULL, 1, NULL, NULL, 'city', NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(22, 3, 'How often do you smoke?', NULL, 2, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Pollution', 33, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(23, 3, 'How would you describe your stress levels?', NULL, 3, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Stress', 100, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(24, 3, 'Which of these closest resembles your diet?', NULL, 4, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, 'Diet', 100, NULL, 4, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(25, 3, 'On average how many hours of sleep do you get a night?', NULL, 5, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '4-8', 'Sleep', 100, NULL, 6, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(26, 3, 'How many hours a day do you sit in front of a screen, ex phone, computer, tv etc.?', NULL, 6, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-6', 'Blue Light', 100, NULL, 6, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(27, 3, 'On average, how many glasses of water do you drink a day?', NULL, 7, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Hydration', 15, NULL, 6, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(28, 3, 'How much makeup do you wear on a daily basis?', NULL, 8, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Pollution', 33.33, NULL, 6, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(29, 3, 'On average, how many hours a week do you excercize?', NULL, 9, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, '0-100', 'Oxygenation', 100, NULL, 6, '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(30, 2, 'Is your skin prone to Hypopigmentation?', NULL, 7, NULL, NULL, NULL, 'This is the likelihood of skin discoloring associated with aging or after injury.', 1, NULL, NULL, NULL, '', '0-100', 'Hypopigmentation', 100, NULL, 6, '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;

-- Dumping structure for table mkd.quiz
DROP TABLE IF EXISTS `quiz`;
CREATE TABLE IF NOT EXISTS `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.quiz: ~3 rows (approximately)
DELETE FROM `quiz`;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
	(1, 'The Basics', 'Let’s start by getting to know you.', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, 'Your Skin', 'Let’s learn about your skin and it’s uniqueness.', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(3, 'Your Environment', 'Almost done, let’s talk environment & lifestyle.', '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;

-- Dumping structure for table mkd.refer_log
DROP TABLE IF EXISTS `refer_log`;
CREATE TABLE IF NOT EXISTS `refer_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `referrer_user_id` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.refer_log: ~0 rows (approximately)
DELETE FROM `refer_log`;
/*!40000 ALTER TABLE `refer_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `refer_log` ENABLE KEYS */;

-- Dumping structure for table mkd.result_profile
DROP TABLE IF EXISTS `result_profile`;
CREATE TABLE IF NOT EXISTS `result_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section_title` varchar(255) DEFAULT NULL,
  `output_variable_list` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.result_profile: ~3 rows (approximately)
DELETE FROM `result_profile`;
/*!40000 ALTER TABLE `result_profile` DISABLE KEYS */;
INSERT INTO `result_profile` (`id`, `section_title`, `output_variable_list`, `created_at`, `updated_at`) VALUES
	(1, 'Skin Sensitivity', '[6,7,13,11,10]', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(2, 'Skin Characteristics', '[14,15,17,16,8]', '2022-04-10 11:07:44', '2022-04-10 11:07:44'),
	(3, 'Environmental Factors', '[19,21,24,25]', '2022-04-10 11:07:44', '2022-04-10 11:07:44');
/*!40000 ALTER TABLE `result_profile` ENABLE KEYS */;

-- Dumping structure for table mkd.role
DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.role: ~2 rows (approximately)
DELETE FROM `role`;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` (`id`, `name`, `created_at`, `updated_at`) VALUES
	(1, 'admin', '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, 'member', '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;

-- Dumping structure for table mkd.rule
DROP TABLE IF EXISTS `rule`;
CREATE TABLE IF NOT EXISTS `rule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `output_variable_name` varchar(255) DEFAULT NULL,
  `actives` text DEFAULT NULL,
  `operator` int(11) DEFAULT NULL,
  `compare_value` float DEFAULT NULL,
  `min` float DEFAULT NULL,
  `max` float DEFAULT NULL,
  `action` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.rule: ~1 rows (approximately)
DELETE FROM `rule`;
/*!40000 ALTER TABLE `rule` DISABLE KEYS */;
INSERT INTO `rule` (`id`, `output_variable_name`, `actives`, `operator`, `compare_value`, `min`, `max`, `action`, `created_at`, `updated_at`) VALUES
	(1, 'Age', '["Camomile"]', 3, 30, NULL, NULL, 2, '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `rule` ENABLE KEYS */;

-- Dumping structure for table mkd.setting
DROP TABLE IF EXISTS `setting`;
CREATE TABLE IF NOT EXISTS `setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `maintenance` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.setting: ~6 rows (approximately)
DELETE FROM `setting`;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` (`id`, `key`, `type`, `value`, `maintenance`, `created_at`, `updated_at`) VALUES
	(1, 'site_name', 0, 'Createdby', NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(2, 'site_logo', 0, 'https://createdby.co/assets/img/logo.png', NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(3, 'maintenance', 1, '0', NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(4, 'version', 0, '1.0.0', NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(5, 'copyright', 0, 'Copyright © 2021 Createdby. All rights reserved.', NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43'),
	(6, 'license_key', 4, '4097fbd4f340955de76ca555c201b185cf9d6921d977301b05cdddeae4af54f924f0508cd0f7ca66', NULL, '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;

-- Dumping structure for table mkd.sms
DROP TABLE IF EXISTS `sms`;
CREATE TABLE IF NOT EXISTS `sms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `tag` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.sms: ~1 rows (approximately)
DELETE FROM `sms`;
/*!40000 ALTER TABLE `sms` DISABLE KEYS */;
INSERT INTO `sms` (`id`, `slug`, `tag`, `content`, `created_at`, `updated_at`) VALUES
	(1, 'verify', 'code', 'Your verification # is {{{code}}}', '2022-04-10 11:07:43', '2022-04-10 11:07:43');
/*!40000 ALTER TABLE `sms` ENABLE KEYS */;

-- Dumping structure for table mkd.token
DROP TABLE IF EXISTS `token`;
CREATE TABLE IF NOT EXISTS `token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ttl` int(11) DEFAULT NULL,
  `issue_at` datetime DEFAULT NULL,
  `expire_at` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.token: ~0 rows (approximately)
DELETE FROM `token`;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
/*!40000 ALTER TABLE `token` ENABLE KEYS */;

-- Dumping structure for table mkd.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `profile_id` int(11) DEFAULT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `refer` varchar(255) DEFAULT NULL,
  `stripe_uid` varchar(255) DEFAULT NULL,
  `paypal_uid` varchar(255) DEFAULT NULL,
  `expire_at` date DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table mkd.user: ~2 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `role_id`, `profile_id`, `organization_id`, `first_name`, `last_name`, `phone`, `image`, `refer`, `stripe_uid`, `paypal_uid`, `expire_at`, `status`, `created_at`, `updated_at`, `user_id`) VALUES
	(1, 1, NULL, NULL, 'Admin', 'Admin', '12345678', '/image/profile.png', 'admin', NULL, NULL, NULL, 1, '2022-04-10 11:07:43', '2022-04-10 11:07:43', NULL),
	(2, 2, NULL, NULL, 'Member', 'Member', '12345678', '/image/profile.png', 'member', NULL, NULL, NULL, 1, '2022-04-10 11:07:43', '2022-04-10 11:07:43', NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
