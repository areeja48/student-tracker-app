// app/page.tsx (Next.js 13+)
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tr  from-blue-100 to-purple-200 text-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to <span className="text-blue-600">Student Tracker</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Your personal dashboard for managing <strong>assignments</strong>, <strong>activities</strong>,
          and <strong>academic progress</strong>. Stay organized and never miss a deadline again!
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-10">
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="border border-blue-600 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-md text-lg font-semibold transition"
          >
            Register
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard
            title="📚 Courses & Assignments"
            description="Track due dates, submission status, and instructor details."
          />
          <FeatureCard
            title="📆 Activities & Calendar"
            description="Visualize all your deadlines and events in calendars."
          />
          <FeatureCard
            title="📊 Progress Analytics"
            description="Get visual insights with charts on your performance and completion rates."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-md border hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
