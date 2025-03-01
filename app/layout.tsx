import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import FaviIcon from '@/components/FaviIcon';
import Header from '@/components/Header';
import { MediaProvider } from '@/providers/MediaProvider';
import { MicrophoneContextProvider } from '@/providers/MicrophoneContextProvider';
import { SocketProvider } from '@/providers/SocketProvider';

import { roboto } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neuralwaves',
  description: 'Your Interview Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <FaviIcon />
      </head>
      <body
        className={`${roboto.variable} bg-background flex min-h-screen flex-col overflow-auto `}>
        <Header />
        <SocketProvider>
          <MediaProvider>
            <MicrophoneContextProvider>{children}</MicrophoneContextProvider>
          </MediaProvider>
        </SocketProvider>
        <Toaster
          position="top-right"
          duration={3000}
          visibleToasts={2}
          richColors
        />
      </body>
    </html>
  );
}
