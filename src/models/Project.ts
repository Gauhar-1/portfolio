import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  links?: {
    website?: string;
    github?: string;
    demo?: string;
  };
}

const ProjectSchema: Schema<IProject> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
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
});

const Project: Model<IProject> = models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
