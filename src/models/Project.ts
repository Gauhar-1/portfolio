import mongoose, { Schema, Document, models, Model } from 'mongoose';

export type ProjectCategory = 'AI_RAG' | 'SYSTEMS_ENGINES' | 'FULLSTACK_SAAS';

export interface IProject extends Document {
  title: string;
  slug: string;
  category: ProjectCategory;
  featuredOrder: number;
  tagline: string;
  overview: string;
  technologies: string[];
  imageUrl: string;
  videoUrl?: string;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;

  // Optional legacy fields for backwards compatibility with existing documents in Mongo
  diagramUrl?: string;
  dxSnippet?: string;
  impactMetrics?: any[];
  systemFeatures?: any[];
  architecturalChallenges?: any[];
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['AI_RAG', 'SYSTEMS_ENGINES', 'FULLSTACK_SAAS'],
      default: 'AI_RAG',
      required: true,
    },
    featuredOrder: {
      type: Number,
      default: 99,
    },
    tagline: {
      type: String,
      required: [true, 'Please provide a tagline.'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Please provide an overview.'],
      trim: true,
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    imageUrl: {
      type: String,
      required: [true, 'A cover image URL is required.'],
      trim: true,
    },
    videoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    links: {
      website: { type: String, default: '', trim: true },
      github: { type: String, default: '', trim: true },
      demo: { type: String, default: '', trim: true },
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  } else if (this.slug) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  next();
});

const Project: Model<IProject> =
  models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
