import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  ipAddress?: string;
  userAgent: string;
  inferredPersona?: Types.ObjectId;
  pageViews: { path: string; duration: number; timestamp: Date }[];
  clickedProjects: Types.ObjectId[];
  startTime: Date;
  lastActiveAt: Date;
}

const SessionSchema: Schema<ISession> = new Schema({
  sessionId: { type: String, required: true, unique: true },
  ipAddress: { type: String },
  userAgent: { type: String, required: true },
  inferredPersona: { type: Schema.Types.ObjectId, ref: 'Persona' },
  pageViews: [{
    path: String,
    duration: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  clickedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  startTime: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now }
});

const Session: Model<ISession> = models.Session || mongoose.model<ISession>('Session', SessionSchema);
export default Session;
