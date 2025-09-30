"use client";

import { ThemeProvider } from 'next-themes';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            <ThemeProvider attribute= 'class'>
           <div className='ml-64'>
              <Header/>
            </div> 
            <Sidebar />
            <main>{children}</main>
            </ThemeProvider>
        </div>
    );
}
