import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ILinks extends Document {
  github: string;
  linkedin: string;
  resumeUrl: string;
  x: string;
  email: string;
  profilePhotoUrl: string;
}

const LinksSchema: Schema<ILinks> = new Schema({
  github: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  resumeUrl: {
    type: String,
  },
  x: {
    type: String,
  },
  email: {
    type: String,
  },
  profilePhotoUrl: {
    type: String,
  }
});

const Links: Model<ILinks> = models.Links || mongoose.model<ILinks>('Links', LinksSchema);

export default Links;
