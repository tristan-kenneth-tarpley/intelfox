import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import QueryClientProvider from '@/components/QueryClientProvider';
import { inter } from './styles/fonts';

export const metadata: Metadata = {
  title: 'IntelFox',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en">
        <body className={inter.className}>
          <QueryClientProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme="dark"
              enableSystem={false}
              forcedTheme={'dark'}
              disableTransitionOnChange
            >
              <main className="bg-zinc-950 min-h-screen dark">
                {children}
              </main>
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
