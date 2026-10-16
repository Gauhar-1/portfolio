'use server';

import * as z from 'zod';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Session from '@/models/Session';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  companyOrRole: z.string().optional(),
  intent: z
    .enum(['INTERVIEW_REQUEST', 'FOUNDING_ROLE', 'FREELANCE_BUILD', 'PORTFOLIO_REVIEW'])
    .default('INTERVIEW_REQUEST'),
  rating: z.number().min(1).max(5).optional(),
  message: z.string().min(5),
  sessionId: z.string().optional(),
});

export async function submitContactForm(formData: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.' };
  }

  try {
    await dbConnect();
    const { name, email, companyOrRole, intent, rating, message, sessionId } = validatedFields.data;

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      companyOrRole: companyOrRole ? companyOrRole.trim() : '',
      intent: intent || 'INTERVIEW_REQUEST',
      rating,
      message: message.trim(),
      status: 'UNREAD',
      sessionId: sessionId ? String(sessionId) : undefined,
    });

    if (sessionId) {
      try {
        await Session.findOneAndUpdate(
          { sessionId: String(sessionId) },
          {
            $inc: { intentScore: 50 },
            $push: {
              interactionLog: {
                action: `Submitted Contact Dispatch: ${intent || 'INTERVIEW_REQUEST'}`,
                timestamp: new Date(),
              },
            },
            $set: { lastActiveAt: new Date() },
          }
        );
      } catch (err) {
        console.error('Session update error in submitContactForm:', err);
      }
    }

    return { success: true, dispatchId: String(newMessage._id) };
  } catch (error) {
    console.error('Error saving message:', error);
    return { success: false, error: 'Failed to save message.' };
  }
}
