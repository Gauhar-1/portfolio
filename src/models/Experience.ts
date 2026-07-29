import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  company: string;
  date: string;
  description: string;
  technologies: string[];
  links?: {
    website?: string;
    github?: string;
  };
  allowedPersonas?: mongoose.Types.ObjectId[];
}

const ExperienceSchema: Schema<IExperience> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
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
});

const Experience: Model<IExperience> = models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
