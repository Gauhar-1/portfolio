import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IStory {
  theme: 'Problem Solved' | 'Mistake Made' | 'Conflict Resolved' | 'Influenced Decision' | 'Proudest Build';
  situation: string;
  challenge: string;
  action: string;
  result: string;
  learning: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
  };
  allowedPersonas?: mongoose.Types.ObjectId[];
  stories?: IStory[];
}

const StorySchema = new Schema<IStory>({
  theme: {
    type: String,
    enum: ['Problem Solved', 'Mistake Made', 'Conflict Resolved', 'Influenced Decision', 'Proudest Build'],
    required: true,
  },
  situation: { type: String, required: true },
  challenge: { type: String, required: true },
  action: { type: String, required: true },
  result: { type: String, required: true },
  learning: { type: String, required: true },
});

const ProjectSchema: Schema<IProject> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  technologies: {
    type: [String],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  links: {
    website: String,
    github: String,
    demo: String,
  },
  allowedPersonas: [{ type: Schema.Types.ObjectId, ref: 'Persona' }],
  stories: [StorySchema],
});

ProjectSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

const Project: Model<IProject> = models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
