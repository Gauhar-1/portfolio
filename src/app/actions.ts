'use server';

import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function sendEmail(formData: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields.' };
  }

  const { name, email, message } = validatedFields.data;

  // In a real application, you would use an email service like Resend, Nodemailer, or SendGrid.
  // For this example, we'll just log the data to the console.
  console.log('--- New Message ---');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);
  console.log('Recipient: mdg_ug-22@mech.nits.ac.in');
  console.log('-------------------');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
}
