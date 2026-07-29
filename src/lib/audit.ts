import mongoose from 'mongoose';
import AuditLog from '@/models/AuditLog';

interface AuditPayload {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityId: mongoose.Types.ObjectId | string;
  changes?: Record<string, any>;
  adminId?: string;
}

export const logAuditAction = async (payload: AuditPayload) => {
  try {
    await AuditLog.create({
      ...payload,
      adminId: payload.adminId || 'system', // Default to system if not provided
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // We swallow the error here to prevent the main API request from failing 
    // just because the audit log failed to write.
  }
};
