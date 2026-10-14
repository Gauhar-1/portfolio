import mongoose, { Schema, Document, models, Model } from 'mongoose';

export type EmploymentType =
  | 'Freelance'
  | 'Contract'
  | 'Full-Time'
  | 'Part-Time'
  | 'Founding Engineer'
  | 'Internship';

export interface IExperience extends Document {
  title: string;
  company: string;
  slug: string;
  domainTag: string;
  employmentType: EmploymentType;
  date: string;
  description: string;
  technologies: string[];
  keyMetric?: string;
  links?: {
    website?: string;
    github?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ExperienceSchema: Schema<IExperience> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name.'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug.'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    domainTag: {
      type: String,
      default: 'Systems & Full-Stack Architecture',
      trim: true,
    },
    employmentType: {
      type: String,
      enum: [
        'Freelance',
        'Contract',
        'Full-Time',
        'Part-Time',
        'Founding Engineer',
        'Internship',
      ],
      default: 'Freelance',
    },
    date: {
      type: String,
      required: [true, 'Please provide a date range.'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description.'],
      trim: true,
    },
    technologies: {
      type: [String],
      required: true,
    },
    keyMetric: {
      type: String,
      default: '',
    },
    links: {
      website: { type: String, trim: true },
      github: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.pre('validate', function (next) {
  if (!this.slug && this.company) {
    this.slug = this.company.toLowerCase().replace(/\s+/g, '');
  } else if (this.slug) {
    this.slug = this.slug.toLowerCase().replace(/\s+/g, '');
  }
  next();
});

ExperienceSchema.pre('save', function (next) {
  if (!this.slug && this.company) {
    this.slug = this.company.toLowerCase().replace(/\s+/g, '');
  } else if (this.slug) {
    this.slug = this.slug.toLowerCase().replace(/\s+/g, '');
  }
  next();
});

const Experience: Model<IExperience> =
  models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
