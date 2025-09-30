'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';  // <-- Import Link
import { useTheme } from '@/components/ThemeContext';
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
   const { theme, toggleTheme } = useTheme();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/auth/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An unexpected error occurred.');
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
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Login link below the form */}
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className=" hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
