import type { AstroGlobal } from 'astro';

export type Tier = 'owner' | 'admin' | 'user' | 'preview';

const TIER_RANK: Record<Tier, number> = { owner: 4, admin: 3, user: 2, preview: 1 };

/** Map better-auth member role to our tier system. */
function roleToTier(role: string): Tier {
  if (role === 'owner') return 'owner';
  if (role === 'admin') return 'admin';
  return 'user'; // better-auth 'member' → our 'user'
}

function higherTier(a: Tier, b: Tier): Tier {
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

/**
 * Resolve the effective tier for a user within an organization.
 * Checks member role first, then group memberships for possible upgrades.
 */
export async function resolveUserTier(userId: string, orgId: string): Promise<Tier> {
  const { db } = await import('../db/client');
  const { member, group, groupMembership } = await import('../db/schema');
  const { eq, and } = await import('drizzle-orm');

  // Get the user's org member record
  const [memberRow] = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.userId, userId), eq(member.organizationId, orgId)));

  if (!memberRow) return 'preview'; // not a member → lowest tier

  let tier = roleToTier(memberRow.role);

  // Check group memberships for tier overrides (highest wins)
  const groupRows = await db
    .select({
      tierOverride: groupMembership.tierOverride,
      defaultTier: group.defaultTier,
    })
    .from(groupMembership)
    .innerJoin(group, eq(groupMembership.groupId, group.id))
    .where(and(eq(groupMembership.userId, userId), eq(group.organizationId, orgId)));

  for (const row of groupRows) {
    const groupTier = (row.tierOverride ?? row.defaultTier) as Tier;
    tier = higherTier(tier, groupTier);
  }

  return tier;
}

/**
 * Check if a user has a specific permission (tier baseline + grant overrides).
 */
export async function hasPermission(
  userId: string,
  orgId: string,
  resource: string,
  action: string,
  resourceId?: string,
): Promise<boolean> {
  const { db } = await import('../db/client');
  const { permission, tierPermission, grant: grantTable, groupMembership } = await import('../db/schema');
  const { eq, and, or, isNull } = await import('drizzle-orm');

  const tier = await resolveUserTier(userId, orgId);

  // Owner bypasses all checks
  if (tier === 'owner') return true;

  // Find the permission row
  const [perm] = await db
    .select({ id: permission.id })
    .from(permission)
    .where(and(eq(permission.resource, resource), eq(permission.action, action)));

  if (!perm) return false;

  // Check tier baseline
  const [tierPerm] = await db
    .select({ id: tierPermission.id })
    .from(tierPermission)
    .where(and(eq(tierPermission.tier, tier), eq(tierPermission.permissionId, perm.id)));

  let allowed = !!tierPerm;

  // Check explicit grants (user-level)
  const userGrants = await db
    .select({ effect: grantTable.effect })
    .from(grantTable)
    .where(and(
      eq(grantTable.organizationId, orgId),
      eq(grantTable.subjectType, 'user'),
      eq(grantTable.subjectId, userId),
      eq(grantTable.permissionId, perm.id),
      resourceId
        ? or(isNull(grantTable.resourceId), eq(grantTable.resourceId, resourceId))
        : isNull(grantTable.resourceId),
    ));

  for (const g of userGrants) {
    if (g.effect === 'deny') return false;
    if (g.effect === 'allow') allowed = true;
  }

  // Check group grants
  const userGroups = await db
    .select({ groupId: groupMembership.groupId })
    .from(groupMembership)
    .where(eq(groupMembership.userId, userId));

  for (const { groupId } of userGroups) {
    const groupGrants = await db
      .select({ effect: grantTable.effect })
      .from(grantTable)
      .where(and(
        eq(grantTable.organizationId, orgId),
        eq(grantTable.subjectType, 'group'),
        eq(grantTable.subjectId, groupId),
        eq(grantTable.permissionId, perm.id),
        resourceId
          ? or(isNull(grantTable.resourceId), eq(grantTable.resourceId, resourceId))
          : isNull(grantTable.resourceId),
      ));

    for (const g of groupGrants) {
      if (g.effect === 'deny') return false;
      if (g.effect === 'allow') allowed = true;
    }
  }

  return allowed;
}

export interface AdminContext {
  user: { id: string; name: string; email: string; image: string | null };
  orgId: string;
  tier: Tier;
}

/**
 * Guard for admin pages and API routes.
 * Returns the resolved context or a Response (401/403).
 */
export async function requireAdmin(locals: AstroGlobal['locals']): Promise<AdminContext | Response> {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const session = locals.session;
  const orgId = (session as Record<string, unknown>)?.activeOrganizationId as string | undefined;
  if (!orgId) {
    return new Response(JSON.stringify({ error: 'No active organization' }), { status: 400 });
  }

  const tier = await resolveUserTier(user.id, orgId);
  if (TIER_RANK[tier] < TIER_RANK['admin']) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  return { user: user as AdminContext['user'], orgId, tier };
}
