import mongoose, { Schema, Document, models, Model } from 'mongoose';

export type MessageIntent =
  | 'INTERVIEW_REQUEST'
  | 'FOUNDING_ROLE'
  | 'FREELANCE_BUILD'
  | 'PORTFOLIO_REVIEW';

export type MessageStatus = 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';

export interface IMessage extends Document {
  name: string;
  email: string;
  companyOrRole?: string;
  intent: MessageIntent;
  rating?: number;
  message: string;
  status: MessageStatus;
  sessionId?: string;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    trim: true,
    lowercase: true,
  },
  companyOrRole: {
    type: String,
    default: '',
    trim: true,
  },
  intent: {
    type: String,
    enum: ['INTERVIEW_REQUEST', 'FOUNDING_ROLE', 'FREELANCE_BUILD', 'PORTFOLIO_REVIEW'],
    default: 'INTERVIEW_REQUEST',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message.'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'],
    default: 'UNREAD',
  },
  sessionId: {
    type: String, // Keep flexible String so client telemetry sessionIds never throw Mongoose CastError
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message: Model<IMessage> =
  models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
