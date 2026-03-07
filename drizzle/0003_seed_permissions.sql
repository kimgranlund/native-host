-- Seed baseline permissions
INSERT INTO `permission` (`id`, `resource`, `action`, `description`) VALUES
  ('perm_llm_read', 'llm', 'read', 'View LLM entries'),
  ('perm_llm_create', 'llm', 'create', 'Create LLM entries'),
  ('perm_llm_update', 'llm', 'update', 'Update LLM entries'),
  ('perm_llm_delete', 'llm', 'delete', 'Delete LLM entries'),
  ('perm_llm_grant', 'llm', 'grant', 'Grant LLM access to others'),
  ('perm_connector_read', 'connector', 'read', 'View connectors'),
  ('perm_connector_create', 'connector', 'create', 'Create connectors'),
  ('perm_connector_update', 'connector', 'update', 'Update connectors'),
  ('perm_connector_delete', 'connector', 'delete', 'Delete connectors'),
  ('perm_connector_grant', 'connector', 'grant', 'Grant connector access to others'),
  ('perm_user_read', 'user', 'read', 'View users'),
  ('perm_user_create', 'user', 'create', 'Invite users'),
  ('perm_user_update', 'user', 'update', 'Update user roles'),
  ('perm_user_delete', 'user', 'delete', 'Remove users'),
  ('perm_content_read', 'content', 'read', 'View content types'),
  ('perm_content_create', 'content', 'create', 'Create content types'),
  ('perm_content_update', 'content', 'update', 'Update content types'),
  ('perm_content_delete', 'content', 'delete', 'Delete content types');
--> statement-breakpoint

-- Seed tier baselines: owner gets all, admin gets most, user gets read, preview gets limited
-- Owner: all permissions
INSERT INTO `tier_permission` (`id`, `tier`, `permission_id`) VALUES
  ('tp_owner_01', 'owner', 'perm_llm_read'),
  ('tp_owner_02', 'owner', 'perm_llm_create'),
  ('tp_owner_03', 'owner', 'perm_llm_update'),
  ('tp_owner_04', 'owner', 'perm_llm_delete'),
  ('tp_owner_05', 'owner', 'perm_llm_grant'),
  ('tp_owner_06', 'owner', 'perm_connector_read'),
  ('tp_owner_07', 'owner', 'perm_connector_create'),
  ('tp_owner_08', 'owner', 'perm_connector_update'),
  ('tp_owner_09', 'owner', 'perm_connector_delete'),
  ('tp_owner_10', 'owner', 'perm_connector_grant'),
  ('tp_owner_11', 'owner', 'perm_user_read'),
  ('tp_owner_12', 'owner', 'perm_user_create'),
  ('tp_owner_13', 'owner', 'perm_user_update'),
  ('tp_owner_14', 'owner', 'perm_user_delete'),
  ('tp_owner_15', 'owner', 'perm_content_read'),
  ('tp_owner_16', 'owner', 'perm_content_create'),
  ('tp_owner_17', 'owner', 'perm_content_update'),
  ('tp_owner_18', 'owner', 'perm_content_delete');
--> statement-breakpoint

-- Admin: CRUD but no grant
INSERT INTO `tier_permission` (`id`, `tier`, `permission_id`) VALUES
  ('tp_admin_01', 'admin', 'perm_llm_read'),
  ('tp_admin_02', 'admin', 'perm_llm_create'),
  ('tp_admin_03', 'admin', 'perm_llm_update'),
  ('tp_admin_04', 'admin', 'perm_llm_delete'),
  ('tp_admin_05', 'admin', 'perm_connector_read'),
  ('tp_admin_06', 'admin', 'perm_connector_create'),
  ('tp_admin_07', 'admin', 'perm_connector_update'),
  ('tp_admin_08', 'admin', 'perm_connector_delete'),
  ('tp_admin_09', 'admin', 'perm_user_read'),
  ('tp_admin_10', 'admin', 'perm_user_create'),
  ('tp_admin_11', 'admin', 'perm_user_update'),
  ('tp_admin_12', 'admin', 'perm_user_delete'),
  ('tp_admin_13', 'admin', 'perm_content_read'),
  ('tp_admin_14', 'admin', 'perm_content_create'),
  ('tp_admin_15', 'admin', 'perm_content_update'),
  ('tp_admin_16', 'admin', 'perm_content_delete');
--> statement-breakpoint

-- User: read-only
INSERT INTO `tier_permission` (`id`, `tier`, `permission_id`) VALUES
  ('tp_user_01', 'user', 'perm_llm_read'),
  ('tp_user_02', 'user', 'perm_connector_read'),
  ('tp_user_03', 'user', 'perm_user_read'),
  ('tp_user_04', 'user', 'perm_content_read');
--> statement-breakpoint

-- Preview: limited read (LLM + connector only)
INSERT INTO `tier_permission` (`id`, `tier`, `permission_id`) VALUES
  ('tp_preview_01', 'preview', 'perm_llm_read'),
  ('tp_preview_02', 'preview', 'perm_connector_read');
