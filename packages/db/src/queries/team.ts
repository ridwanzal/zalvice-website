import { and, asc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { teamMembers } from '../schema/team-members.js';
import { media } from '../schema/media.js';

export type PublicTeamMember = {
  id: number;
  name: string;
  role: string;
  team: 'design' | 'eng' | 'infra' | 'ops';
  yearsExperience: number;
  bio: string;
  photoUrl: string | null;
  photoAlt: string | null;
  social: { kind: 'linkedin' | 'github' | 'x'; url: string }[] | null;
};

export async function getActiveTeamMembers(): Promise<PublicTeamMember[]> {
  const rows = await db
    .select({
      id: teamMembers.id,
      name: teamMembers.name,
      role: teamMembers.role,
      team: teamMembers.team,
      yearsExperience: teamMembers.yearsExperience,
      bio: teamMembers.bio,
      social: teamMembers.socialLinks,
      photoUrl: media.url,
      photoAlt: media.altText,
    })
    .from(teamMembers)
    .leftJoin(media, eq(teamMembers.photoId, media.id))
    .where(eq(teamMembers.active, true))
    .orderBy(asc(teamMembers.sortOrder));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    team: r.team,
    yearsExperience: r.yearsExperience,
    bio: r.bio,
    photoUrl: r.photoUrl ?? null,
    photoAlt: r.photoAlt ?? null,
    social: (r.social as PublicTeamMember['social']) ?? null,
  }));
}

// Used by /about's filter count chips.
export async function countTeamByGroup(): Promise<Record<string, number>> {
  // Drizzle's group/count needs a raw expression; simpler to do a single
  // select-all-active and bucket in JS for now.
  void and; // silence unused-import warning when this body is replaced
  const members = await getActiveTeamMembers();
  const counts: Record<string, number> = {};
  for (const m of members) counts[m.team] = (counts[m.team] ?? 0) + 1;
  return counts;
}
