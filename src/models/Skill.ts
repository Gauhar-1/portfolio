import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  icon: string;
}

const SkillSchema: Schema<ISkill> = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    maxlength: [60, 'Category cannot be more than 60 characters'],
  },
  icon: {
    type: String,
    required: [true, 'Please provide an icon name.'],
    maxlength: [40, 'Icon name cannot be more than 40 characters'],
  },
});

const Skill: Model<ISkill> = models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
