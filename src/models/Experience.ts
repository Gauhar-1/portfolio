import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IStory {
  theme: 'Problem Solved' | 'Mistake Made' | 'Conflict Resolved' | 'Influenced Decision' | 'Proudest Build';
  situation: string;
  challenge: string;
  action: string;
  result: string;
  learning: string;
}

export interface IExperience extends Document {
  title: string;
  slug: string;
  company: string;
  date: string;
  description: string;
  technologies: string[];
  links?: {
    website?: string;
    github?: string;
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

const ExperienceSchema: Schema<IExperience> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
  },
  slug: {
    type: String,
    unique: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name.'],
  },
  date: {
    type: String,
    required: [true, 'Please provide a date range.'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  technologies: {
    type: [String],
    required: true,
  },
  links: {
    website: String,
    github: String,
  },
  allowedPersonas: [{ type: Schema.Types.ObjectId, ref: 'Persona' }],
  stories: [StorySchema],
});

ExperienceSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = `${this.title}-${this.company}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

const Experience: Model<IExperience> = models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
