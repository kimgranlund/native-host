-- Add active_organization_id to session (better-auth org plugin)
ALTER TABLE `session` ADD COLUMN `active_organization_id` text;
--> statement-breakpoint

-- better-auth organization plugin tables
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo` text,
	`metadata` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);
--> statement-breakpoint

CREATE TABLE `member` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`organization_id` text NOT NULL REFERENCES `organization`(`id`) ON DELETE CASCADE,
	`role` text NOT NULL DEFAULT 'member',
	`created_at` integer NOT NULL
);
--> statement-breakpoint

CREATE TABLE `invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`inviter_id` text NOT NULL REFERENCES `user`(`id`),
	`organization_id` text NOT NULL REFERENCES `organization`(`id`) ON DELETE CASCADE,
	`role` text NOT NULL DEFAULT 'member',
	`status` text NOT NULL DEFAULT 'pending',
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint

-- Groups (sub-grouping within orgs)
CREATE TABLE `group` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL REFERENCES `organization`(`id`) ON DELETE CASCADE,
	`name` text NOT NULL,
	`description` text,
	`default_tier` text NOT NULL DEFAULT 'user',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint

CREATE TABLE `group_membership` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL REFERENCES `group`(`id`) ON DELETE CASCADE,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`tier_override` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_user_idx` ON `group_membership` (`group_id`, `user_id`);
--> statement-breakpoint

-- Permissions & Access
CREATE TABLE `permission` (
	`id` text PRIMARY KEY NOT NULL,
	`resource` text NOT NULL,
	`action` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `perm_resource_action_idx` ON `permission` (`resource`, `action`);
--> statement-breakpoint

CREATE TABLE `tier_permission` (
	`id` text PRIMARY KEY NOT NULL,
	`tier` text NOT NULL,
	`permission_id` text NOT NULL REFERENCES `permission`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tier_perm_idx` ON `tier_permission` (`tier`, `permission_id`);
--> statement-breakpoint

CREATE TABLE `grant` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL REFERENCES `organization`(`id`) ON DELETE CASCADE,
	`subject_type` text NOT NULL,
	`subject_id` text NOT NULL,
	`permission_id` text NOT NULL REFERENCES `permission`(`id`) ON DELETE CASCADE,
	`effect` text NOT NULL DEFAULT 'allow',
	`resource_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint

-- Content Schemas (LLM Registry, Connectors, etc.)
CREATE TABLE `content_type` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`schema` text NOT NULL,
	`versioned` integer NOT NULL DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_type_slug_unique` ON `content_type` (`slug`);
--> statement-breakpoint

CREATE TABLE `content_object` (
	`id` text PRIMARY KEY NOT NULL,
	`content_type_id` text NOT NULL REFERENCES `content_type`(`id`) ON DELETE CASCADE,
	`slug` text NOT NULL,
	`data` text NOT NULL,
	`version` integer NOT NULL DEFAULT 1,
	`status` text NOT NULL DEFAULT 'active',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_slug_type_idx` ON `content_object` (`content_type_id`, `slug`);
--> statement-breakpoint

CREATE TABLE `content_visibility` (
	`id` text PRIMARY KEY NOT NULL,
	`content_type_id` text NOT NULL REFERENCES `content_type`(`id`) ON DELETE CASCADE,
	`tier` text NOT NULL,
	`visible_fields` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_vis_idx` ON `content_visibility` (`content_type_id`, `tier`);
