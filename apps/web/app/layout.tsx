import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Presentei',
  description: 'Lembra, Escolhe e Surpreende.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={inter.variable}>
      <body className={`${inter.className} bg-brand-off-white text-brand-purple-dark antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
