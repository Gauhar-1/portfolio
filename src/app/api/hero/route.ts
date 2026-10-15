import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroConfig from '@/models/HeroConfig';
import Architecture from '@/models/Architecture';
import Links from '@/models/Links';
import { architecturesData } from '@/data/architectures';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch or initialize HeroConfig singleton
    let heroConfig = await HeroConfig.findOne({}).lean();
    if (!heroConfig) {
      const created = await HeroConfig.create({});
      heroConfig = created.toObject();
    }

    // 2. Fetch live Links
    const links = await Links.findOne({}).lean();

    // 3. Extract architecture slugs & query Architecture collection
    const slots = heroConfig.loadoutSlots || [];
    const slugs = slots.map((s) => s.architectureSlug);

    const architectures = await Architecture.find({ slug: { $in: slugs } })
      .select('slug name theme hero challenges')
      .lean();

    const archMap = new Map<string, any>();
    for (const arch of architectures) {
      archMap.set(arch.slug, arch);
    }

    // 4. Populate each slot with Architecture details (with static dictionary fallback)
    const populatedSlots = slots.map((slot, index) => {
      const dbArch = archMap.get(slot.architectureSlug);
      const fallbackArch = architecturesData[slot.architectureSlug];

      const name = dbArch?.name || fallbackArch?.name || slot.architectureSlug;
      const theme = dbArch?.theme || fallbackArch?.theme || {
        primaryHex: '#10B981',
        backgroundHex: '#0A0A0C',
        textHex: '#F8FAFC',
      };

      const heroSubtitle = dbArch?.hero?.subtitle || fallbackArch?.hero?.subtitle || '';
      const missionBrief = slot.customBrief?.trim() ? slot.customBrief : heroSubtitle;

      const rawMetrics = dbArch?.hero?.metrics || fallbackArch?.hero?.metrics || [];
      const combatStats = rawMetrics.slice(0, 3).map((m: any) => ({
        label: (m.title || 'METRIC').toUpperCase(),
        value: m.value || 'N/A',
      }));

      const rawChallenges = dbArch?.challenges || fallbackArch?.challenges || [];
      const pipeline = rawChallenges.slice(0, 3).map((c: any) => c.title || 'Subsystem');

      return {
        key: String(index + 1),
        slotNumber: slot.slotNumber || `0${index + 1}`,
        architectureSlug: slot.architectureSlug,
        roleClass: slot.roleClass,
        weaponName: `${name} — System Architecture`,
        weaponTag: `LOADOUT // ${slot.architectureSlug.toUpperCase().replace(/-/g, '_')}`,
        theme,
        primaryHex: theme.primaryHex,
        bgHex: theme.backgroundHex,
        textHex: theme.textHex,
        missionBrief: missionBrief || 'Production architecture specification and performance benchmarks.',
        combatStats: combatStats.length > 0 ? combatStats : [
          { label: 'EFFICIENCY', value: '99%' },
          { label: 'UPTIME', value: '99.9%' },
          { label: 'LATENCY', value: '<50ms' },
        ],
        pipeline: pipeline.length > 0 ? pipeline : ['Ingress Gateway', 'State Engine', 'Storage Replica'],
        deepDiveUrl: `/architecture/${slot.architectureSlug}`,
      };
    });

    return NextResponse.json(
      {
        heroConfig,
        populatedSlots,
        links: links || {
          github: 'https://github.com/Gauhar-1',
          linkedin: 'https://linkedin.com/in/mdgoharkhan',
          x: 'https://x.com',
          email: 'mustakkhan1210@gmail.com',
          resumeUrl: '/resume.pdf',
          profilePhotoUrl: heroConfig.avatarUrl || '/Gauhar.png',
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[GET /api/hero] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero configuration', details: error.message },
      { status: 500 }
    );
  }
}
