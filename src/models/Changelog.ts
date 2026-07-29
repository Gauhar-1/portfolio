import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export interface IChangelog extends Document {
  title: string;
  type: 'Release' | 'Patch' | 'Post-Mortem';
  content: string;
  relatedProjects: Types.ObjectId[];
  relatedSkills: Types.ObjectId[];
  publishDate: Date;
}

const ChangelogSchema: Schema<IChangelog> = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Release', 'Patch', 'Post-Mortem'], required: true },
  content: { type: String, required: true },
  relatedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  relatedSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  publishDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Changelog: Model<IChangelog> = models.Changelog || mongoose.model<IChangelog>('Changelog', ChangelogSchema);
export default Changelog;
