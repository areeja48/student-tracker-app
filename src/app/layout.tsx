"use client";
import './globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/ThemeContext'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body  className=" dark:bg-gray-900  dark:text-white">
        <ThemeProvider>
        <SessionProvider>{children}</SessionProvider>
         </ThemeProvider>
      </body>
    </html>
  );
}
