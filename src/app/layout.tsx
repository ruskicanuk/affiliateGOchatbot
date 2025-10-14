import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Green Office Villas Chatbot',
  description: 'AI-powered retreat planning assistant for Green Office Villas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
