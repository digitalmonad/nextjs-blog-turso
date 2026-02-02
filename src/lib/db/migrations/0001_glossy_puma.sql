CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(128) NOT NULL,
	`icon` text(2000) NOT NULL,
	`count` integer NOT NULL
);
