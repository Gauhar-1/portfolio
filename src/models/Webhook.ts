import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IWebhook extends Document {
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
}

const WebhookSchema: Schema<IWebhook> = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  events: { type: [String], required: true },
  isActive: { type: Boolean, default: true },
  secret: { type: String, required: true }
}, { timestamps: true });

const Webhook: Model<IWebhook> = models.Webhook || mongoose.model<IWebhook>('Webhook', WebhookSchema);
export default Webhook;
