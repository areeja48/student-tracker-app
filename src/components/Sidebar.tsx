'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simple SVG icons

const icons = {
  Dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
  Courses: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 010 6.844L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
    </svg>
  ),
  Assignments: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2-10H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
    </svg>
  ),
  Activities: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 12h.01" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
    </svg>
  ),
  Progress: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19V6m4 13v-4m4 4V10M5 19V13" />
    </svg>
  ),
  Calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Desktop sidebar toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile sidebar visibility
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false); // Close on route change
  }, [pathname]);

   type IconName = keyof typeof icons;

  const navItems: { name: IconName; href: string }[] =  [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Courses', href: '/dashboard/courses' },
    { name: 'Assignments', href: '/dashboard/assignments' },
    { name: 'Activities', href: '/dashboard/activities' },
    { name: 'Progress', href: '/dashboard/progress' },
    { name: 'Calendar', href: '/dashboard/calendar' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-blue-800 text-white flex flex-col
          transition-all duration-300 ease-in-out z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-64
          md:translate-x-0 ${isOpen ? 'md:w-64' : 'md:w-16'}
        `}
        aria-label="Sidebar"
      >
        {/* Desktop toggle */}
        <button
          aria-label="Toggle sidebar"
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:block m-4 p-2 bg-gray-700 rounded-md self-start focus:outline-none"
        >
          {isOpen ? <span>&larr;</span> : <span>&rarr;</span>}
        </button>

        {/* Mobile close */}
        <button
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden m-4 p-2 bg-gray-700 rounded-md self-start focus:outline-none text-white text-2xl"
        >
          &times;
        </button>

        {/* Navigation */}
        <nav className="flex flex-col mt-10 space-y-1 flex-grow">
          {navItems.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-blue-700 transition-colors duration-200 ${
                  isActive ? 'bg-blue-900 font-semibold' : 'font-normal'
                }`}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center ${
                    isOpen ? 'mr-3' : 'mx-auto md:mx-0'
                  }`}
                >
                  {icons[name]}
                </div>
                {/* Desktop: show only if open */}
                {isOpen && <span className=" md:inline">{name}</span>}
                {/* Mobile: always show label */}
                {!isOpen && <span className="md:hidden text-center ">{name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700 text-center text-sm">
          {isOpen ? 'Student Tracker' : 'ST'}
        </div>
      </aside>

      {/* Mobile hamburger button */}
      <button
        aria-label="Open sidebar"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-700 text-white md:hidden focus:outline-none"
      >
        {/* Hamburger Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
