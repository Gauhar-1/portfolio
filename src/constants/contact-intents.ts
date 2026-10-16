export const CONTACT_INTENTS = {
  INTERVIEW_REQUEST: {
    intentKey: 'INTERVIEW_REQUEST',
    label: '⚡ Schedule Interview',
    roleClass: 'TECHNICAL SCREEN & SQUAD FIT',
    primaryHex: '#1037b9ff', // Cyber Emerald
    backgroundHex: '#98e465ff', // Deep Stealth Obsidian
    textHex: '#000000ff', // Crisp White
    visualType: 'interview-pipeline',
    visualTitle: 'INTERVIEW_PROTOCOL // < 4H SLA',
    headline: 'Fast-track from first call to Day-1 production impact.',
    subheadline:
      'Skip the resume guessing game. Walk through live production architectures, codebase trade-offs, and system design in a focused technical screen.',
    templateMessage:
      'Hi Gohar, we reviewed your architecture case studies and would love to schedule an introductory technical interview for an engineering role at [Company].',
    secondaryInputLabel: 'Company / JD Link (Optional)',
    secondaryInputPlaceholder: 'e.g. Acme AI, Series A venture, or Job Link',
  },
  FOUNDING_ROLE: {
    intentKey: 'FOUNDING_ROLE',
    label: '🚀 Founding / Core Role',
    roleClass: '0-TO-1 SYSTEMS OWNERSHIP',
    primaryHex: '#360bf5ff', // Executive Amber
    backgroundHex: '#fa932cff', // Warm Carbon
    textHex: '#000000ff', // Warm White
    visualType: 'founding-ownership',
    visualTitle: 'FULL_STACK_OWNERSHIP_MATRIX // 0-TO-1',
    headline: '0-to-1 end-to-end ownership across stack and unit economics.',
    subheadline:
      'Built for high-velocity founding teams that need one engineer to own database schemas, edge caching, AI pipelines, and 60fps interfaces.',
    templateMessage:
      "Hi Gohar, we're building a high-scale product and looking for an engineer who can own systems from database schema to production. Let's connect.",
    secondaryInputLabel: 'Venture / Stage (Optional)',
    secondaryInputPlaceholder: 'e.g. Stealth AI Lab, Seed/Series A',
  },
  FREELANCE_BUILD: {
    intentKey: 'FREELANCE_BUILD',
    label: '🛠️ Freelance / Contract',
    roleClass: 'SYSTEM ARCHITECTURE & BUILD',
    primaryHex: '#32ee67ff', // Sovereign Blue
    backgroundHex: '#f704f3ff', // Deep Navy Obsidian
    textHex: '#000000ff', // Crisp White
    visualType: 'freelance-delivery',
    visualTitle: 'DELIVERY_BLUEPRINT // MILESTONE_LOCKED',
    headline: 'Predictable milestones. Production-tested architecture.',
    subheadline:
      'From initial RFC and schema design to load-tested deployment—shipping custom full-stack and AI products with zero technical debt.',
    templateMessage:
      'Hi Gohar, we have a product or architecture build requiring full-stack/AI ownership. Here is a brief overview of our requirements:',
    secondaryInputLabel: 'Project Scope / Target (Optional)',
    secondaryInputPlaceholder: 'e.g. High-throughput event streaming migration',
  },
  PORTFOLIO_REVIEW: {
    intentKey: 'PORTFOLIO_REVIEW',
    label: '🏆 Portfolio Review',
    roleClass: 'SYSTEM AUDIT & KUDOS',
    primaryHex: '#B91C1C', // Editorial Crimson
    backgroundHex: '#E6E4DD', // Warm Editorial Paper (Light Theme!)
    textHex: '#111115', // Deep Ink Charcoal
    visualType: 'review-scorecard',
    visualTitle: 'LIVE_PORTFOLIO_TELEMETRY',
    headline: 'Audit the system. Share your engineering feedback.',
    subheadline:
      'Explored the Operator HUD, Chameleon Experience Stack, or Architecture Bento grids? Rate the execution and drop a note in the logbook.',
    templateMessage:
      'Just went through your operator HUD, architecture deep dives, and project arsenal—wanted to drop a quick review of your system design:',
    secondaryInputLabel: 'Your Role / Title (Optional)',
    secondaryInputPlaceholder: 'e.g. Staff Engineer, Design Lead, Hiring Manager',
  },
} as const;

export type ContactIntentKey = keyof typeof CONTACT_INTENTS;
export type ContactIntentConfig = (typeof CONTACT_INTENTS)[ContactIntentKey];
export type ContactVisualType = ContactIntentConfig['visualType'];
