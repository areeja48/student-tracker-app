'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext';

export default function Header() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  if (status === "loading") {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
   <div className="bg-blue-800 text-white p-4 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-y-4 md:gap-y-0 md:gap-x-6">
      <div>
        <h1 className="text-4xl font-extrabold flex items-center gap-3 select-none">
          👋 Welcome, {session?.user?.name || "User"}!
        </h1>
        <p className="mt-2 text-base text-blue-200 font-medium">
          You are logged in as <strong>{session?.user?.email}</strong>
        </p>
      </div>
       <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
      >
        Log Out
      </button>
    </div>
  );
}
