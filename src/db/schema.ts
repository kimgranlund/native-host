import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

// ══════════════════════════════════════════════
// better-auth core tables
// ══════════════════════════════════════════════

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id),
  activeOrganizationId: text('active_organization_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// ══════════════════════════════════════════════
// better-auth organization plugin tables
// ══════════════════════════════════════════════

export const organization = sqliteTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const member = sqliteTable('member', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const invitation = sqliteTable('invitation', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  inviterId: text('inviter_id').notNull().references(() => user.id),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  status: text('status').notNull().default('pending'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ══════════════════════════════════════════════
// Groups (extend orgs with sub-grouping)
// ══════════════════════════════════════════════

export const group = sqliteTable('group', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  defaultTier: text('default_tier').notNull().default('user'), // owner | admin | user | preview
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const groupMembership = sqliteTable('group_membership', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => group.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  tierOverride: text('tier_override'), // null = inherit group.defaultTier
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (t) => [
  uniqueIndex('group_user_idx').on(t.groupId, t.userId),
]);

// ══════════════════════════════════════════════
// Permissions & Access
// ══════════════════════════════════════════════

export const permission = sqliteTable('permission', {
  id: text('id').primaryKey(),
  resource: text('resource').notNull(),       // 'llm', 'connector', 'content', 'user', 'billing'
  action: text('action').notNull(),           // 'read', 'create', 'update', 'delete', 'grant'
  description: text('description'),
}, (t) => [
  uniqueIndex('perm_resource_action_idx').on(t.resource, t.action),
]);

export const tierPermission = sqliteTable('tier_permission', {
  id: text('id').primaryKey(),
  tier: text('tier').notNull(),               // owner | admin | user | preview
  permissionId: text('permission_id').notNull().references(() => permission.id, { onDelete: 'cascade' }),
}, (t) => [
  uniqueIndex('tier_perm_idx').on(t.tier, t.permissionId),
]);

export const grant = sqliteTable('grant', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  subjectType: text('subject_type').notNull(), // 'user' | 'group'
  subjectId: text('subject_id').notNull(),     // user.id or group.id
  permissionId: text('permission_id').notNull().references(() => permission.id, { onDelete: 'cascade' }),
  effect: text('effect').notNull().default('allow'), // 'allow' | 'deny'
  resourceId: text('resource_id'),             // null = all, or specific contentObject.id
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ══════════════════════════════════════════════
// Content Schemas (LLM Registry, Connectors, etc.)
// ══════════════════════════════════════════════

export const contentType = sqliteTable('content_type', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),       // 'llm-description', 'connector', 'prompt-template'
  name: text('name').notNull(),
  schema: text('schema').notNull(),            // JSON Schema string
  versioned: integer('versioned', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const contentObject = sqliteTable('content_object', {
  id: text('id').primaryKey(),
  contentTypeId: text('content_type_id').notNull().references(() => contentType.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),                // 'claude-sonnet-4', 'github-mcp'
  data: text('data').notNull(),                // JSON blob validated against contentType.schema
  version: integer('version').notNull().default(1),
  status: text('status').notNull().default('active'), // active | deprecated | draft
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (t) => [
  uniqueIndex('content_slug_type_idx').on(t.contentTypeId, t.slug),
]);

export const contentVisibility = sqliteTable('content_visibility', {
  id: text('id').primaryKey(),
  contentTypeId: text('content_type_id').notNull().references(() => contentType.id, { onDelete: 'cascade' }),
  tier: text('tier').notNull(),                // owner | admin | user | preview
  visibleFields: text('visible_fields').notNull(), // JSON array of field paths
}, (t) => [
  uniqueIndex('content_vis_idx').on(t.contentTypeId, t.tier),
]);

// ══════════════════════════════════════════════
// User preferences (existing)
// ══════════════════════════════════════════════

export const userPreferences = sqliteTable('user_preferences', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  colorScheme: text('color_scheme').default(''),
  sidebarCollapsed: integer('sidebar_collapsed', { mode: 'boolean' }).default(false),
  groupStates: text('group_states').default('{}'),
  showCode: integer('show_code', { mode: 'boolean' }).default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
