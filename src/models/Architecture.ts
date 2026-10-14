import mongoose, { Schema, Document, models, Model } from 'mongoose';

// ─── Sub-document Interfaces ────────────────────────────────────────────────

export interface IArchitectureTheme {
  primaryHex: string;
  backgroundHex: string;
  textHex: string;
}

export interface IArchitectureHeroMetric {
  title: string;
  value: string;
  ariaLabel?: string;
}

export interface IArchitectureHero {
  title: string;
  subtitle: string;
  metrics: IArchitectureHeroMetric[];
}

export interface IArchitectureChallenge {
  id: string;
  title: string;
  teaser: string;
  problem: string;
  solution: string;
  impact: string;
  visualKey: string;
}

export interface IArchitectureRoadmapItem {
  phase: string;
  title: string;
  description: string;
}

// ─── Main Document Interface ────────────────────────────────────────────────

export interface IArchitecture extends Document {
  slug: string;
  name: string;
  theme: IArchitectureTheme;
  hero: IArchitectureHero;
  challenges: IArchitectureChallenge[];
  roadmap: IArchitectureRoadmapItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-document Schemas ───────────────────────────────────────────────────

const ThemeSchema = new Schema<IArchitectureTheme>(
  {
    primaryHex: { type: String, required: true, default: '#10b981' },
    backgroundHex: { type: String, required: true, default: '#0a0a0c' },
    textHex: { type: String, required: true, default: '#f8fafc' },
  },
  { _id: false }
);

const HeroMetricSchema = new Schema<IArchitectureHeroMetric>(
  {
    title: { type: String, required: true },
    value: { type: String, required: true },
    ariaLabel: { type: String, default: '' },
  },
  { _id: false }
);

const HeroSchema = new Schema<IArchitectureHero>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    metrics: { type: [HeroMetricSchema], default: [] },
  },
  { _id: false }
);

const ChallengeSchema = new Schema<IArchitectureChallenge>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    teaser: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    impact: { type: String, required: true },
    visualKey: {
      type: String,
      required: true,
      default: 'chart',
      enum: [
        'chart',
        'security',
        'server',
        'layout-orchestrator',
        'block-ast',
        'schema-compiler',
        'ChartVisual',
        'SecurityVisual',
        'ServerVisual',
        'LayoutOrchestratorVisual',
        'BlockAstVisual',
        'SchemaCompilerVisual',
      ],
    },
  },
  { _id: false }
);

const RoadmapItemSchema = new Schema<IArchitectureRoadmapItem>(
  {
    phase: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

// ─── Master Document Schema ─────────────────────────────────────────────────

const ArchitectureSchema = new Schema<IArchitecture>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    theme: {
      type: ThemeSchema,
      required: true,
    },
    hero: {
      type: HeroSchema,
      required: true,
    },
    challenges: {
      type: [ChallengeSchema],
      default: [],
    },
    roadmap: {
      type: [RoadmapItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ArchitectureSchema.pre('save', function (next) {
  if (this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Architecture: Model<IArchitecture> =
  models.Architecture ||
  mongoose.model<IArchitecture>('Architecture', ArchitectureSchema);

export default Architecture;
