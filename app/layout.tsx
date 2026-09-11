import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata = {
  title: 'EcoQuest — Gamified Personal Carbon Footprint AI',
  description: 'AI-powered gamified personal carbon footprint tracker for Pune. Measure, play, compete, and reduce your environmental impact.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EcoQuest — Gamified Personal Carbon Footprint AI</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@600;700&family=Hanken+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0b110e] text-[#e4e2de] antialiased selection:bg-[#6bfb9a] selection:text-[#003919]">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
