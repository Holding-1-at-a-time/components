import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import ConvexClerkProvider from '@/providers/ConvexClerkProvider';
import { CoreLayout } from '@/components/layouts/CoreLayoutComponent';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Slick Solutions',
  description: 'Generate your Assessment using AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang='en'>
        <CoreLayout>
          <div className={`${manrope.className}`}>
              {children}
          </div>
        </CoreLayout>
      </html>
    </ConvexClerkProvider>
  );
}