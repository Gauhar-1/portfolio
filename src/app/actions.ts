'use server';

import * as z from 'zod';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(formData: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.' };
  }

  try {
    await dbConnect();
    await Message.create(validatedFields.data);
    return { success: true };
  } catch (error) {
    console.error('Error saving message:', error);
    return { success: false, error: 'Failed to save message.' };
  }
}
