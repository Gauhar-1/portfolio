
import { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'MD Gohar Khan | Freelance Software Engineer & Full-Stack Developer',
  description: 'Portfolio of MD Gohar Khan, a Software Engineer from NIT Silchar. Specializing in freelance full-stack development, high-concurrency distributed platforms, WebSockets, and building production-grade web applications.',
  keywords: [
    'MD Gohar Khan',
    'Gauhar',
    'Freelance Software Engineer',
    'Freelance Full-Stack Developer',
    'Contract Web Development',
    'Software Engineer NIT Silchar',
    'Next.js Developer',
    'WebSockets',
    'High Concurrency',
    'SDLC',
    'Microservices',
    'Production-Grade Systems'
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark">
      <head>
        <title>DevFolio | Full-Stack Developer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
