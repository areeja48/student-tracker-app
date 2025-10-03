'use client';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type Assignment = {
  _id: string;
  title: string;
  instructor: string;
  dueDate: string; // ISO date string
  totalMarks: string;
  obtainedMarks?: string;
  status: 'Pending' | 'Submitted' | 'Overdue';
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    instructor: '',
    dueDate: '',
    totalMarks: '',
    obtainedMarks: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/assignments');
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      setAssignments(data);

      // 🔔 Check for pending assignments due in next 24h
      const now = new Date();
      const soon = new Date(now.getTime() + 1000 * 60 * 60 * 48); // next 24 hours

      data.forEach((a: Assignment) => {
        if (a.status === 'Pending') {
          const due = new Date(a.dueDate);
          if (due >= now && due <= soon) {
            if (window.electron) {
              window.electron.send('show-notification', {
                title: '📌 Assignment Due Soon',
                body: `${a.title} due on ${due.toLocaleString()}`,
              });
            }
          }
        }
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
    setLoading(false);
  }

  async function saveAssignment() {
    const { title, instructor, dueDate, totalMarks, obtainedMarks } = form;

    if (!title || !instructor || !dueDate || !totalMarks) {
      setError('Please fill in all required fields except obtained marks');
      return;
    }

    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDateObj <= today && (!obtainedMarks || obtainedMarks.trim() === '')) {
      setError('Please enter obtained marks for assignments past due date');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        title,
        instructor,
        dueDate: new Date(dueDate).toISOString(),
        totalMarks,
        ...(obtainedMarks ? { obtainedMarks } : {}),
        ...(editingId ? { id: editingId } : {}),
      };

      const res = await fetch('/api/assignments', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save assignment');
      }

      setForm({ title: '', instructor: '', dueDate: '', totalMarks: '', obtainedMarks: '' });
      setEditingId(null);
      fetchAssignments();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.user?.email && window.electron) {
      window.electron.send('set-user', session.user.email);
      console.log('🔐 Sent user email to Electron:', session.user.email);
    }
  }, [session]);


  async function deleteAssignment(id: string) {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/assignments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete assignment');
      }

      fetchAssignments();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
      setLoading(false);
    }
  }

  function editAssignment(assignment: Assignment) {
    setForm({
      title: assignment.title,
      instructor: assignment.instructor,
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks,
      obtainedMarks: assignment.obtainedMarks || '',
    });
    setEditingId(assignment._id);
  }

  function cancelEdit() {
    setForm({ title: '', instructor: '', dueDate: '', totalMarks: '', obtainedMarks: '' });
    setEditingId(null);
    setError('');
  }

  const isObtainedMarksDisabled = form.dueDate
    ? new Date() < new Date(form.dueDate)
    : true;

  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');
  const submittedAssignments = assignments.filter((a) => a.status === 'Submitted');

  return (
    <div className="max-w-4xl mx-auto p-6 text-black-900">
      <h1 className="text-3xl font-bold mb-6">Your Assignments</h1>

      {/* Notifications */}
      <div className="mb-6">
        <p className="font-semibold text-lg text-red-500">
          Pending Assignments: {pendingAssignments.length}
        </p>
        <p className="font-semibold text-lg text-green-500">
          Submitted Assignments: {submittedAssignments.length}
        </p>
      </div>

      {pendingAssignments.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 font-semibold">
          ⚠️ You have {pendingAssignments.length} pending assignment
          {pendingAssignments.length > 1 ? 's' : ''} to submit!
        </div>
      )}

      {/* Error */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Form */}
      <div className="mb-8 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {editingId ? 'Edit Assignment' : 'Add New Assignment'}
        </h2>

        <input
          type="text"
          placeholder="Assignment Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border text-gray-900 rounded mb-3"
        />

        <input
          type="text"
          placeholder="Instructor Name"
          value={form.instructor}
          onChange={(e) => setForm({ ...form, instructor: e.target.value })}
          className="w-full p-2 border text-gray-900 rounded mb-3"
        />

        <Flatpickr
          placeholder="Due Date"
          options={{ enableTime: true, dateFormat: 'Y-m-d H:i' }}
          value={form.dueDate ? [new Date(form.dueDate)] : []}
          onChange={(dates) => {
            if (dates.length > 0) {
              setForm({ ...form, dueDate: dates[0].toISOString() });
            } else {
              setForm({ ...form, dueDate: '' });
            }
          }}
          className="w-full mb-4 p-2 text-gray-900 border rounded"
        />

        <input
          type="number"
          placeholder="Total Marks"
          value={form.totalMarks}
          onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
          className="w-full p-2 border text-gray-900 rounded mb-3"
          min={0}
        />

        <input
          type="number"
          placeholder="Obtained Marks"
          value={form.obtainedMarks}
          onChange={(e) => setForm({ ...form, obtainedMarks: e.target.value })}
          className="w-full p-2 border text-gray-900 rounded mb-3"
          min={0}
          disabled={isObtainedMarksDisabled}
        />

        <div>
          <button
            onClick={saveAssignment}
            disabled={loading}
            className="mr-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' : editingId ? 'Update Assignment' : 'Add Assignment'}
          </button>

          {editingId && (
            <button
              onClick={cancelEdit}
              disabled={loading}
              className="bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && <p>Loading assignments...</p>}

      {/* Assignment list */}
      <div className="space-y-4">
        {assignments.length === 0 && <p>No assignments found. Add some!</p>}

        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className={`p-4 bg-white rounded shadow flex justify-between items-center ${
              assignment.status === 'Pending'
                ? 'border-l-4 border-yellow-500'
                : assignment.status === 'Submitted'
                ? 'border-l-4 border-green-500'
                : 'border-l-4 border-red-500'
            }`}
          >
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{assignment.title}</h3>
              <p className="text-sm text-gray-600">Instructor: {assignment.instructor}</p>
              <p className="text-sm text-gray-600">Due Date: {assignment.dueDate}</p>
              <p className="text-sm text-gray-600">Total Marks: {assignment.totalMarks}</p>
              <p className="text-sm text-gray-600">
                Obtained Marks: {assignment.obtainedMarks || 'Not submitted'}
              </p>
              <p
                className={`font-semibold ${
                  assignment.status === 'Pending'
                    ? 'text-yellow-600'
                    : assignment.status === 'Submitted'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                Status: {assignment.status}
              </p>
            </div>

            <div>
              <button
                onClick={() => editAssignment(assignment)}
                className="mr-3 text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteAssignment(assignment._id)}
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
