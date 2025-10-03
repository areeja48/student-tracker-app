'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      router.push('/dashboard'); // Protected page
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <button
        onClick={toggleTheme}
        className="px-3 py-2 ml-67 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
      >
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        {/* Forgot Password Link */}
        <div className="text-right">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="hover:underline">
          Sign up
        </Link>
      </p>
      <button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      className="w-full flex items-center mt-5 justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 shadow-md transition-colors duration-200 font-medium"
    >
      {/* Clean Google G logo */}
      <svg
        className="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 46 46"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <path
            id="a"
            d="M44.5 20H24v6h11.9C34.1 31.7 29.2 35 24 35 16.8 35 11 29.2 11 22S16.8 9 24 9c3.7 0 6.9 1.4 9.3 3.7l4-4C33 5.9 28.7 4 24 4 12.95 4 4.5 12.45 4.5 23.5S12.95 43 24 43c11.05 0 19.5-8.45 19.5-19 0-1.3-.15-2.6-.5-3.8z"
          />
        </defs>
        <clipPath id="b">
          <use href="#a" overflow="visible" />
        </clipPath>
        <path
          fill="#FBBC05"
          d="M0 37V9l17 14z"
          clipPath="url(#b)"
        />
        <path
          fill="#EA4335"
          d="M0 9l17 14 7-6.1L48 14V0H0z"
          clipPath="url(#b)"
        />
        <path
          fill="#34A853"
          d="M0 37l30-23 7.9 1L48 0v48H0z"
          clipPath="url(#b)"
        />
        <path
          fill="#4285F4"
          d="M48 48L17 24l-4-3 35-10z"
          clipPath="url(#b)"
        />
      </svg>
      Sign in with Google
    </button>
    </div>
  );
}
