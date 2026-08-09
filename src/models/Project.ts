import mongoose, { Schema, Document, models, Model } from 'mongoose';

// --- Sub-document interfaces ---

export interface IImpactMetric {
  label: string;
  value: string;
  context: string;
}

export interface ISystemFeature {
  featureTitle: string;
  description: string;
}

export interface IArchitecturalChallenge {
  theme: string;
  bottleneck: string;
  solution: string;
  tradeoff: string;
}

// --- Main document interface ---

export interface IProject extends Document {
  title: string;
  slug: string;
  tagline: string;
  overview: string;
  technologies: string[];
  imageUrl: string;
  diagramUrl?: string;
  videoUrl?: string;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
  };
  impactMetrics: IImpactMetric[];
  systemFeatures: ISystemFeature[];
  architecturalChallenges: IArchitecturalChallenge[];
  dxSnippet?: string;
}

// --- Sub-document schemas ---

const ImpactMetricSchema = new Schema<IImpactMetric>({
  label: { type: String, required: true },
  value: { type: String, required: true },
  context: { type: String, required: true },
});

const SystemFeatureSchema = new Schema<ISystemFeature>({
  featureTitle: { type: String, required: true },
  description: { type: String, required: true },
});

const ArchitecturalChallengeSchema = new Schema<IArchitecturalChallenge>({
  theme: { type: String, required: true },
  bottleneck: { type: String, required: true },
  solution: { type: String, required: true },
  tradeoff: { type: String, required: true },
});

// --- Main schema ---

const ProjectSchema: Schema<IProject> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
  },
  slug: {
    type: String,
    unique: true,
  },
  tagline: {
    type: String,
    required: [true, 'Please provide a tagline.'],
  },
  overview: {
    type: String,
    required: [true, 'Please provide an overview.'],
  },
  technologies: {
    type: [String],
    required: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'A cover image URL is required.'],
  },
  diagramUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  links: {
    website: String,
    github: String,
    demo: String,
  },
  impactMetrics: [ImpactMetricSchema],
  systemFeatures: [SystemFeatureSchema],
  architecturalChallenges: [ArchitecturalChallengeSchema],
  dxSnippet: {
    type: String,
  },
});

ProjectSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

const Project: Model<IProject> = models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
