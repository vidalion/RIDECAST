import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GradientWrapper } from '@/components/gradient-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ridecast - Cycling Weather Verdict',
  description: 'Your daily commute verdict based on wind and rain thresholds',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ridecast',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <GradientWrapper>
          {children}
        </GradientWrapper>
      </body>
    </html>
  );
}
