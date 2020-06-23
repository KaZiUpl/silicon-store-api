SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


DROP TABLE IF EXISTS `amounts`;
CREATE TABLE IF NOT EXISTS `amounts` (
  `item_id` int(10) UNSIGNED NOT NULL,
  `amount` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `amounts` (`item_id`, `amount`) VALUES
(1, 25),
(2, 15),
(3, 10),
(4, 10),
(5, 0),
(6, 20),
(7, 15),
(8, 10),
(9, 10),
(10, 10),
(11, 25),
(12, 12),
(13, 50),
(14, 5);

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED NOT NULL,
  `amount` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`,`item_id`),
  KEY `cart_items_item_id_foreign` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `parent_id`, `name`, `path`) VALUES
(1, NULL, 'Urządzenia peryferyjne', '1'),
(2, NULL, 'Laptopy i komputery', '2'),
(3, NULL, 'Akcesoria', '3'),
(4, NULL, 'Gaming', '4'),
(5, 1, 'Monitory', '1/5'),
(6, 1, 'Drukarki', '1/6'),
(7, 1, 'Klawiatury', '1/7'),
(8, 7, 'Klawiatury przewodowe', '1/7/8'),
(9, 7, 'Klawiatury bezprzewodowe', '1/7/9'),
(10, 2, 'Laptopy', '2/10'),
(11, 10, 'Laptopy 15\'\'', '2/10/11'),
(12, 2, 'Komputery stacjonarne', '2/12'),
(13, 3, 'Kable i przejściówki', '3/13'),
(14, 4, 'Konsole', '4/14'),
(15, 4, 'Gry', '4/15'),
(16, 15, 'Gry na PC', '4/15/16'),
(17, 15, 'Gry na PlayStation', '4/15/17'),
(18, 15, 'Gry na Xbox', '4/15/18'),
(19, 14, 'Konsole Xbox', '4/14/19'),
(20, 14, 'Konsole PlayStation', '4/14/20');

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED NOT NULL,
  `text` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_user_id_foreign` (`user_id`),
  KEY `comments_item_id_foreign` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double(8,2) UNSIGNED NOT NULL,
  `short_specification` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `specification` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `items_category_id_foreign` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `items` (`id`, `category_id`, `name`, `price`, `short_specification`, `specification`, `description`, `photo`) VALUES
(1, 1, 'Test peripheral', 2500.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(2, 2, 'Test laptop', 1199.99, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(3, 11, 'Test laptop 15\'\'', 1199.99, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(4, 12, 'Test PC', 1199.99, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(5, 13, 'Test cable', 4999.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(6, 8, 'Test wired keyboard', 249.99, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(7, 9, 'Test wireless keyboard', 249.99, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(8, 5, 'Test monitor', 1299.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(9, 6, 'Test printer', 499.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(10, 16, 'Test PC game', 129.99, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(11, 18, 'Test Xbox game', 249.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(12, 17, 'Test Playstation game', 300.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(13, 20, 'Test Playstation console', 1600.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png'),
(14, 19, 'Test Xbox console', 850.00, '<tr><td>Option 1</td><td>value</td></tr><tr><td>Option 2</td><td> some other value</td></tr><tr><td>Option 3</td><td>another value</td></tr>', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio voluptatem excepturi, reiciendis alias, temporibus mollitia sit illum voluptatum earum officia repellendus non. Quibusdam optio molestiae dolor. Ad in maiores aut odio consequuntur, laboriosam doloremque at, voluptatibus praesentium omnis impedit facilis labore, fugit modi ex exercitationem enim magni blanditiis qui repellat?', 'placeholder.png');

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED NOT NULL,
  `amount` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`order_id`,`item_id`),
  KEY `order_items_item_id_foreign` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_key` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_name_unique` (`name`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `amounts`
  ADD CONSTRAINT `amounts_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `cart_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments`
  ADD CONSTRAINT `comments_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `items`
  ADD CONSTRAINT `items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
