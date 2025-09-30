'use client';

import { useState, useEffect } from 'react';

type Course = {
  _id: string;
  title: string;
  instructor: string;
  progress: number; 
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state for add/edit
  const [form, setForm] = useState({ title: '', instructor: '', progress: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/courses', {
      credentials: 'include',
});
      
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err: unknown) {
        if (err instanceof Error) {
      setError(err.message);
  } else {
    setError('Something went wrong');
  }
    }
    setLoading(false);
  }

  // Create or Update course
  async function saveCourse() {
    if (!form.title || !form.instructor) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save course');
      }

      setForm({ title: '', instructor: '', progress: 0 });
      setEditingId(null);
      fetchCourses();
    } catch (err: unknown) {
      if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Something went wrong');
  }
      setLoading(false);
    }
  }

  // Delete a course
  async function deleteCourse(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete course');
      }

      fetchCourses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
  }
      setLoading(false);
    }
  }

  // Edit a course - fill form with course data
  function editCourse(course: Course) {
    setForm({
      title: course.title,
      instructor: course.instructor,
      progress: course.progress,
    });
    setEditingId(course._id);
  }

  // Cancel editing
  function cancelEdit() {
    setForm({ title: '', instructor: '', progress: 0 });
    setEditingId(null);
    setError('');
  }

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6 ">Your Courses</h1>

      {/* Error */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Form for add/edit */}
      <div className="mb-8 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">{editingId ? 'Edit Course' : 'Add New Course'}</h2>

        <input
          type="text"
          placeholder="Course Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border text-gray-900 rounded mb-3"
        />

        <input
          type="text"
          placeholder="Instructor Name"
          value={form.instructor}
          onChange={(e) => setForm({ ...form, instructor: e.target.value })}
          className="w-full p-2 text-gray-900 border rounded mb-3"
        />

        <label className="block mb-1 text-gray-900 font-medium">Progress: {form.progress}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={form.progress}
          onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
          className="w-full mb-4"
        />

        <div>
          <button
            onClick={saveCourse}
            disabled={loading}
            className="mr-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' : editingId ? 'Update Course' : 'Add Course'}
          </button>

          {editingId && (
            <button
              onClick={cancelEdit}
              disabled={loading}
              className="bg-gray-300 px-4 py-2 rounded text-gray-900 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && <p>Loading courses...</p>}

      {/* Course list */}
      <div className="space-y-4">
        {courses.length === 0 && <p>No courses found. Add some!</p>}

        {courses.map((course) => (
          <div
            key={course._id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
              <p className="text-sm text-gray-600">Progress: {course.progress}%</p>
            </div>

            <div>
              <button
                onClick={() => editCourse(course)}
                className="mr-3 text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCourse(course._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
