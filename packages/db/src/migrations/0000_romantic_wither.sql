CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`role` enum('admin','editor') NOT NULL DEFAULT 'editor',
	`disabled` boolean NOT NULL DEFAULT false,
	`totp_secret` varchar(64),
	`last_login` datetime,
	`created_at` datetime NOT NULL,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255),
	`ip` varchar(64) NOT NULL,
	`success` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	CONSTRAINT `login_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` datetime NOT NULL,
	`ip` varchar(64),
	`user_agent` varchar(500),
	CONSTRAINT `user_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`logo_image_id` int,
	`website` varchar(500),
	`industry` varchar(100),
	`featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`consent_to_display` boolean NOT NULL DEFAULT false,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`value` bigint NOT NULL,
	`label` varchar(200) NOT NULL,
	`suffix` varchar(8) NOT NULL DEFAULT '',
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `stats_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`name` varchar(100) NOT NULL,
	`pillar` enum('design','dev','infra','support','consulting') NOT NULL,
	`description` text NOT NULL,
	`capabilities` json NOT NULL,
	`icon` varchar(64) NOT NULL,
	`engagement_model` text,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`alt_text` varchar(500) NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`mime_type` varchar(64) NOT NULL,
	`bytes` bigint NOT NULL,
	`focal_x` decimal(4,3) NOT NULL DEFAULT '0.5',
	`focal_y` decimal(4,3) NOT NULL DEFAULT '0.5',
	`uploaded_by` int,
	`uploaded_at` datetime NOT NULL,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`locale` enum('en','id') NOT NULL DEFAULT 'en',
	`title` varchar(200) NOT NULL,
	`excerpt` varchar(500) NOT NULL,
	`body_md` text NOT NULL,
	`cover_image_url` varchar(1024),
	`cover_image_alt` varchar(500),
	`cover_image_id` int,
	`category_slug` varchar(80) NOT NULL,
	`author_name` varchar(100) NOT NULL,
	`status` enum('draft','scheduled','published','archived') NOT NULL DEFAULT 'draft',
	`published_at` datetime,
	`scheduled_for` datetime,
	`reading_minutes` int NOT NULL DEFAULT 3,
	`featured` boolean NOT NULL DEFAULT false,
	`seo_title` varchar(200),
	`seo_description` varchar(500),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_locale_idx` UNIQUE(`slug`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`locale` enum('en','id') NOT NULL DEFAULT 'en',
	`client_name` varchar(200) NOT NULL,
	`title` varchar(200) NOT NULL,
	`summary` varchar(500) NOT NULL,
	`body_md` text NOT NULL,
	`hero_image_url` varchar(1024),
	`hero_image_alt` varchar(500),
	`hero_image_id` int,
	`year` int NOT NULL,
	`industry` varchar(100) NOT NULL,
	`services` json NOT NULL,
	`tech_stack` json NOT NULL,
	`outcomes` json NOT NULL,
	`team_size` int NOT NULL,
	`duration_months` int NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`featured_order` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`published_at` datetime,
	`seo_title` varchar(200),
	`seo_description` varchar(500),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_locale_idx` UNIQUE(`slug`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`role` varchar(120) NOT NULL,
	`team` enum('design','eng','infra','ops') NOT NULL,
	`years_experience` int NOT NULL,
	`bio` text NOT NULL,
	`photo_id` int,
	`social_links` json,
	`sort_order` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_id_admin_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_logo_image_id_media_id_fk` FOREIGN KEY (`logo_image_id`) REFERENCES `media`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_cover_image_id_media_id_fk` FOREIGN KEY (`cover_image_id`) REFERENCES `media`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_hero_image_id_media_id_fk` FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_photo_id_media_id_fk` FOREIGN KEY (`photo_id`) REFERENCES `media`(`id`) ON DELETE set null ON UPDATE no action;