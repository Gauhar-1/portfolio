import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IPersona extends Document {
  name: string;
  description: string;
  isDefault: boolean;
  sectionOrder: string[];
  theme?: string;
}

const PersonaSchema: Schema<IPersona> = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  sectionOrder: { type: [String], default: ['projects', 'experience', 'skills'] },
  theme: { type: String, default: 'slate' }
}, { timestamps: true });

const Persona: Model<IPersona> = models.Persona || mongoose.model<IPersona>('Persona', PersonaSchema);
export default Persona;
