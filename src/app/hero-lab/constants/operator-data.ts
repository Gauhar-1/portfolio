// ─────────────────────────────────────────────────────────────────────────────
// Tactical FPS Operator Dossier & Loadout Configuration
// ─────────────────────────────────────────────────────────────────────────────

export interface OperatorIdentity {
  callsign: string;
  classTitle: string;
  headline: string;
  subheadline: string;
  avatarUrl: string;
  fallbackInitials: string;
  badge: string;
  status: string;
  rank: string;
  clearance: string;
  baseNode: string;
}

export interface OperatorAttribute {
  id: string;
  label: string;
  displayValue: string;
  fillPercent: number;
  tier: string;
  category: string;
}

export interface IntelLink {
  id: string;
  label: string;
  url: string;
  keyBind: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'mail' | 'download';
  isPrimary?: boolean;
  tooltip: string;
}

export interface CombatStat {
  label: string;
  value: string;
}

export interface TacticalLoadoutTheme {
  primaryHex: string;
  backgroundHex: string;
  textHex: string;
}

export interface TacticalLoadout {
  key: string;
  id: string;
  slotNumber: string;
  roleClass: string;
  weaponName: string;
  weaponTag: string;
  primaryHex: string;
  bgHex: string;
  textHex: string;
  theme?: TacticalLoadoutTheme;
  missionBrief: string;
  combatStats: CombatStat[];
  pipeline: string[];
  deepDiveUrl: string;
  calloutBadge?: string;
}

// ── 0. Default Operator Theme ─────────────────────────────────────────────────

export const DEFAULT_HERO_THEME: TacticalLoadoutTheme = {
  primaryHex: '#10B981',    // Tactical Operator Emerald
  backgroundHex: '#07090B', // Deep Stealth Obsidian
  textHex: '#F8FAFC',       // Crisp White
};

// ── 1. Operator Identity ──────────────────────────────────────────────────────

export const OPERATOR_IDENTITY: OperatorIdentity = {
  callsign: "OP // MD GOHAR KHAN",
  classTitle: "0-TO-1 SYSTEMS & AI ARCHITECT",
  headline: "I engineer production systems that survive Friday night rushes and protect 98% compute margins.",
  subheadline: "B.Tech NIT Silchar '26 • NCC Cadet • Full-Stack & AI Systems Engineer with end-to-end ownership across FinTech POS, Headless CMS, Hybrid RAG, and Real-Time WebSockets.",
  avatarUrl: "/Gauhar.png",
  fallbackInitials: "GK",
  badge: "STATUS: READY FOR DEPLOYMENT // NITS '26",
  status: "COMBAT_READY // HIGH_CONCURRENCY",
  rank: "TIER-1 DISTRIBUTED ARCHITECT",
  clearance: "LEVEL_4 // SYSTEM_ROOT",
  baseNode: "SILCHAR // 24.7577°N 92.7923°E",
};

// ── 2. Core Operator Attributes (FPS Stat Bars) ──────────────────────────────

export const OPERATOR_ATTRIBUTES: OperatorAttribute[] = [
  {
    id: "attr-1",
    label: "HIGH-CONCURRENCY BACKEND",
    displayValue: "250+ RPS",
    fillPercent: 96,
    tier: "S-TIER",
    category: "DISTRIBUTED_SYSTEMS",
  },
  {
    id: "attr-2",
    label: "EDGE CACHING & LATENCY",
    displayValue: "<250ms P95",
    fillPercent: 98,
    tier: "S-TIER",
    category: "PERFORMANCE_OPT",
  },
  {
    id: "attr-3",
    label: "AI / RAG & HYBRID SEARCH",
    displayValue: "2-Tier + RRF",
    fillPercent: 92,
    tier: "A-TIER",
    category: "APPLIED_GENAI",
  },
  {
    id: "attr-4",
    label: "ZERO-TRUST SECURITY & RLS",
    displayValue: "100% Auth",
    fillPercent: 95,
    tier: "S-TIER",
    category: "INFRA_HARDENING",
  },
];

// ── 3. Comms & Intel Links (Quick-Equip Slots) ───────────────────────────────

export const COMMS_INTEL_LINKS: IntelLink[] = [
  {
    id: "link-gh",
    label: "GitHub",
    url: "https://github.com/Gauhar-1",
    keyBind: "G",
    icon: "github",
    tooltip: "Inspect Production Source Code [Press G]",
  },
  {
    id: "link-li",
    label: "LinkedIn",
    url: "https://linkedin.com/in/mdgoharkhan",
    keyBind: "L",
    icon: "linkedin",
    tooltip: "Verify Professional Record [Press L]",
  },
  {
    id: "link-x",
    label: "X / Twitter",
    url: "https://x.com",
    keyBind: "X",
    icon: "twitter",
    tooltip: "Follow Technical Signals [Press X]",
  },
  {
    id: "link-mail",
    label: "Email Intel",
    url: "mailto:mdgoharkhan44@gmail.com",
    keyBind: "M",
    icon: "mail",
    tooltip: "Direct Operator Uplink [Press M]",
  },
  {
    id: "link-resume",
    label: "Download Intel (Resume)",
    url: "/resume.pdf",
    keyBind: "R",
    icon: "download",
    isPrimary: true,
    tooltip: "Retrieve Confidential Dossier [Press R]",
  },
];

// ── 4. Tactical Role Loadouts (Recruiter Intent Matcher) ──────────────────────

export const TACTICAL_LOADOUTS: TacticalLoadout[] = [
  {
    key: "1",
    id: "fintech-pos",
    slotNumber: "01",
    roleClass: "HIGH-CONCURRENCY & FINTECH",
    weaponName: "QuickBiteQR — Zero-Commission POS",
    weaponTag: "LOADOUT // HIGH_SCALE_POS",
    primaryHex: "#10B981", // Cyber Emerald
    bgHex: "#0A0A0C",
    textHex: "#F8FAFC",
    missionBrief: "Eliminated 25% aggregator commissions for Indian restaurants. Engineered an Upstash Redis edge-cached read pipeline and zero-trust direct UPI checkout at ₹15/mo COGS.",
    combatStats: [
      { label: "COMPUTE MARGIN", value: "98.9%" },
      { label: "DB READ IOPS", value: "-92.4%" },
      { label: "EDGE LATENCY", value: "<250ms" },
    ],
    pipeline: ["QR Edge Scan", "Redis Cache HIT", "Zero-Trust UPI Lock"],
    deepDiveUrl: "/architecture/quickbiteqr",
    calloutBadge: "ZERO-COMMISSION SCALE",
  },
  {
    key: "2",
    id: "cms-saas",
    slotNumber: "02",
    roleClass: "HEADLESS CMS & DYNAMIC UI",
    weaponName: "Founderdiary — Editorial & Intake Engine",
    weaponTag: "LOADOUT // POLYMORPHIC_AST",
    primaryHex: "#F59E0B", // Editorial Amber
    bgHex: "#0C0A09",
    textHex: "#F8FAFC",
    missionBrief: "Engineered myself out of editorial bottlenecks by building a zero-deploy storefront slot orchestrator, polymorphic AST block studio, and runtime JSON form compiler.",
    combatStats: [
      { label: "DEV BOTTLENECK", value: "0 Deploys" },
      { label: "CURATION SYNC", value: "<10 Secs" },
      { label: "CONTENT MODEL", value: "100% AST" },
    ],
    pipeline: ["Admin JSON Schema", "Runtime Compiler", "Block-AST UI"],
    deepDiveUrl: "/architecture/founderdiary",
    calloutBadge: "ZERO-DEPLOY ENGINE",
  },
  {
    key: "3",
    id: "microservices-civic",
    slotNumber: "03",
    roleClass: "DISTRIBUTED MICROSERVICES",
    weaponName: "RajyaSampark — Regional Civic Platform",
    weaponTag: "LOADOUT // ISOLATED_MESH",
    primaryHex: "#3B82F6", // Sovereign Blue
    bgHex: "#080C14",
    textHex: "#F8FAFC",
    missionBrief: "Architected under Dr. Ripon Patgiri (NIT Silchar) to prevent monolithic DB pool crashes during regional voting surges using isolated microservices and Postgres RLS.",
    combatStats: [
      { label: "SERVICE MESH", value: "100% Split" },
      { label: "PUB/SUB SYNC", value: "<45ms" },
      { label: "JURISDICTION", value: "RLS Locked" },
    ],
    pipeline: ["Edge API Gateway", "Redis Pub/Sub", "Postgres RLS Row"],
    deepDiveUrl: "/architecture/rajyasampark",
    calloutBadge: "CIVIC ISOLATION MESH",
  },
  {
    key: "4",
    id: "realtime-webgl",
    slotNumber: "04",
    roleClass: "REAL-TIME STATE & 3D WEBGL",
    weaponName: "TaujiLudo — 1v1 Wager & State Engine",
    weaponTag: "LOADOUT // DETERMINISTIC_SYNC",
    primaryHex: "#EC4899", // Arcade Magenta
    bgHex: "#0D0714",
    textHex: "#F8FAFC",
    missionBrief: "Built a server-authoritative Socket.IO game loop with <50ms state delta sync, an atomic manual-wager KYC escrow ledger, and a 60 FPS Three.js 3D landing page.",
    combatStats: [
      { label: "STATE SYNC", value: "<50ms" },
      { label: "DESYNC RATE", value: "0.00%" },
      { label: "WEBGL HUD", value: "60 FPS" },
    ],
    pipeline: ["Socket.IO Intent", "Server Rule Lock", "Atomic Escrow"],
    deepDiveUrl: "/architecture/taujiludo",
    calloutBadge: "SERVER-AUTHORITATIVE",
  },
];
