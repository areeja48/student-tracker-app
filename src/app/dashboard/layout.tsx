"use client";

import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email && (window).electron) {
      (window).electron.send("set-user", session.user.email);
    }
  }, [session]);

  return (
    <div className="dashboard-layout flex">
      <ThemeProvider attribute="class">
        {/* Sidebar fixed on left */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 ml-64">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </ThemeProvider>
    </div>
  );
}
