import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export interface IAuditLog extends Document {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityId: Types.ObjectId;
  changes: Record<string, any>;
  adminId: string;
  timestamp: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema({
  action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
  entityType: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  changes: { type: Schema.Types.Mixed },
  adminId: { type: String, required: true }
}, { timestamps: true });

const AuditLog: Model<IAuditLog> = models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export default AuditLog;
