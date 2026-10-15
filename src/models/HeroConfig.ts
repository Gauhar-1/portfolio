import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IHeroAttribute {
  label: string;
  displayValue: string;
  fillPercent: number;
}

export interface IHeroLoadoutSlot {
  slotNumber: string;
  architectureSlug: string;
  roleClass: string;
  customBrief?: string;
}

export interface IHeroConfig extends Document {
  callsign: string;
  classTitle: string;
  statusBadge: string;
  headline: string;
  subheadline: string;
  avatarUrl: string;
  attributes: IHeroAttribute[];
  loadoutSlots: IHeroLoadoutSlot[];
  createdAt: Date;
  updatedAt: Date;
}

const HeroAttributeSchema = new Schema<IHeroAttribute>(
  {
    label: { type: String, required: true },
    displayValue: { type: String, required: true },
    fillPercent: { type: Number, required: true, min: 0, max: 100, default: 90 },
  },
  { _id: false }
);

const HeroLoadoutSlotSchema = new Schema<IHeroLoadoutSlot>(
  {
    slotNumber: { type: String, required: true },
    architectureSlug: { type: String, required: true },
    roleClass: { type: String, required: true },
    customBrief: { type: String, default: '' },
  },
  { _id: false }
);

const HeroConfigSchema = new Schema<IHeroConfig>(
  {
    callsign: {
      type: String,
      required: true,
      default: 'OP // MD GOHAR KHAN',
    },
    classTitle: {
      type: String,
      required: true,
      default: '0-TO-1 SYSTEMS & AI ARCHITECT',
    },
    statusBadge: {
      type: String,
      required: true,
      default: "STATUS: READY FOR DEPLOYMENT // NITS '26",
    },
    headline: {
      type: String,
      required: true,
      default:
        'I engineer production systems that survive Friday night rushes and protect 98% compute margins.',
    },
    subheadline: {
      type: String,
      required: true,
      default:
        "B.Tech NIT Silchar '26 • NCC Cadet • Full-Stack & AI Systems Engineer with end-to-end ownership across FinTech POS, Headless CMS, Hybrid RAG, and Real-Time WebSockets.",
    },
    avatarUrl: {
      type: String,
      required: true,
      default: '/Gauhar.png',
    },
    attributes: {
      type: [HeroAttributeSchema],
      default: [
        { label: 'HIGH-CONCURRENCY BACKEND', displayValue: '250+ RPS', fillPercent: 96 },
        { label: 'EDGE CACHING & LATENCY', displayValue: '<250ms P95', fillPercent: 98 },
        { label: 'AI / RAG & HYBRID SEARCH', displayValue: '2-Tier + RRF', fillPercent: 92 },
        { label: 'ZERO-TRUST SECURITY & RLS', displayValue: '100% Auth', fillPercent: 95 },
      ],
    },
    loadoutSlots: {
      type: [HeroLoadoutSlotSchema],
      default: [
        {
          slotNumber: '01',
          architectureSlug: 'quickbiteqr',
          roleClass: 'HIGH-CONCURRENCY & FINTECH',
          customBrief: '',
        },
        {
          slotNumber: '02',
          architectureSlug: 'founderdiary',
          roleClass: 'HEADLESS CMS & DYNAMIC UI',
          customBrief: '',
        },
        {
          slotNumber: '03',
          architectureSlug: 'rajyasampark',
          roleClass: 'DISTRIBUTED MICROSERVICES',
          customBrief: '',
        },
        {
          slotNumber: '04',
          architectureSlug: 'taujiludo',
          roleClass: 'REAL-TIME STATE & 3D WEBGL',
          customBrief: '',
        },
      ],
    },
  },
  { timestamps: true }
);

const HeroConfig: Model<IHeroConfig> =
  models.HeroConfig || mongoose.model<IHeroConfig>('HeroConfig', HeroConfigSchema);

export default HeroConfig;
