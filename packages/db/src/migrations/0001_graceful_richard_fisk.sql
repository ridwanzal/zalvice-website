CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`locale` enum('en','id') NOT NULL DEFAULT 'en',
	`quote` text NOT NULL,
	`author_name` varchar(100) NOT NULL,
	`author_role` varchar(120) NOT NULL,
	`author_company` varchar(120) NOT NULL,
	`author_photo_url` varchar(1024),
	`author_photo_alt` varchar(500),
	`project_id` int,
	`featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE set null ON UPDATE no action;