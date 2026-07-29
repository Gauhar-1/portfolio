
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  sessionId?: mongoose.Types.ObjectId;
}

const MessageSchema: Schema<IMessage> = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a message.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'Session'
  },
});

const Message: Model<IMessage> = models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
