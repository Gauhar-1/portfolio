import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  ipAddress?: string;
  userAgent: string;
  companyName?: string;
  role?: string;
  inferredPersona?: Types.ObjectId;
  slug: string;
  intentScore: number;
  interactionLog: { action: string; timestamp: Date }[];
  pageViews: { path: string; duration: number; timestamp: Date }[];
  clickedProjects: Types.ObjectId[];
  storyPings: { storyTheme: string; duration: number; timestamp: Date }[];
  startTime: Date;
  lastActiveAt: Date;
}

const SessionSchema: Schema<ISession> = new Schema({
  sessionId: { type: String, required: true, unique: true },
  ipAddress: { type: String },
  userAgent: { type: String, required: true },
  companyName: { type: String },
  role: { type: String },
  inferredPersona: { type: Schema.Types.ObjectId, ref: 'Persona' },
  slug: { type: String, required: true, unique: true },
  intentScore: { type: Number, default: 0 },
  interactionLog: [{
    action: String,
    timestamp: { type: Date, default: Date.now }
  }],
  pageViews: [{
    path: String,
    duration: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  clickedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  storyPings: [{
    storyTheme: String,
    duration: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  startTime: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now }
});

const Session: Model<ISession> = models.Session || mongoose.model<ISession>('Session', SessionSchema);
export default Session;
