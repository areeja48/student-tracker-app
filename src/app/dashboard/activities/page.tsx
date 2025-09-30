'use client';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { useState, useEffect } from 'react';

type Activity = {
  _id: string;
  title: string;
  type: string;
  dueDate: string;
  status: 'Pending' | 'Done' | 'Overdue';
  course: string;
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for add/edit
  const [form, setForm] = useState({ title: '', type: '', dueDate: '', course: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch activities on mount
  useEffect(() => {
    fetchActivities();
  }, []);
async function fetchActivities() {
  setLoading(true);
  setError('');
  try {
    const res = await fetch('/api/activities');
    if (!res.ok) throw new Error('Failed to fetch activities');
    const data = await res.json();
    setActivities(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Something went wrong');
    }
  }
  setLoading(false);
}

  // Create or Update activity
  async function saveActivity() {
    if (!form.title || !form.type || !form.dueDate || !form.course) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    const payload = {
  ...form,
  ...(editingId ? { id: editingId } : {}),
};

    try {
      const res = await fetch('/api/activities', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save activity');
      }

      setForm({ title: '', type: '', dueDate: '', course: '' });
      setEditingId(null);
      fetchActivities();
    } catch (err: unknown) {
      if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Something went wrong');
    }
      setLoading(false);
    }
  }

  // Delete an activity
  async function deleteActivity(id: string) {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/activities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete activity');
      }

      fetchActivities();
    } catch (err: unknown) {
       if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Something went wrong');
    }
      setLoading(false);
    }
  }

  // Edit an activity - fill form with activity data
  function editActivity(activity: Activity) {
    setForm({
      title: activity.title,
      type: activity.type,
      dueDate: activity.dueDate, // ISO string
      course: activity.course,
    });
    setEditingId(activity._id);
  }

  // Cancel editing
  function cancelEdit() {
    setForm({ title: '', type: '', dueDate: '', course: '' });
    setEditingId(null);
    setError('');
  }

  const pendingActivities = activities.filter((a) => a.status === 'Pending');
  const doneActivities = activities.filter((a) => a.status === 'Done');

  return (
    <div className="max-w-4xl mx-auto p-6 text-black-900">
      <h1 className="text-3xl font-bold mb-6">Your Activities</h1>

      {/* Notifications */}
      <div className="mb-6">
        <p className="font-semibold text-lg text-red-500">
          Pending Activities: {pendingActivities.length}
        </p>
        <p className="font-semibold text-lg text-green-500">
          Done Activities: {doneActivities.length}
        </p>
      </div>

      {pendingActivities.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 font-semibold">
          ⚠️ You have {pendingActivities.length} pending activity
          {pendingActivities.length > 1 ? 's' : ''} to submit!
        </div>
      )}

      {/* Error */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Form for add/edit */}
      <div className="mb-8 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Activity' : 'Add New Activity'}
        </h2>

        <input
          type="text"
          placeholder="Activity Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border text-gray-900 rounded mb-3"
        />

        <input
          type="text"
          placeholder="Activity Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
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
          type="text"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="w-full p-2 border text-gray-900 rounded mb-3"
        />

        <div>
          <button
            onClick={saveActivity}
            disabled={loading}
            className="mr-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? (editingId ? 'Updating...' : 'Saving...') : editingId ? 'Update Activity' : 'Add Activity'}
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
      {loading && <p>Loading activities...</p>}

      {/* Activity list */}
      <div className="space-y-4">
        {activities.length === 0 && <p>No activities found. Add some!</p>}

        {activities.map((activity) => (
          <div
            key={activity._id}
            className={`p-4 bg-white rounded shadow flex justify-between items-center ${
              activity.status === 'Pending'
                ? 'border-l-4 border-yellow-500'
                : activity.status === 'Done'
                ? 'border-l-4 border-green-500'
                : 'border-l-4 border-red-500'
            }`}
          >
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{activity.title}</h3>
              <p className="text-sm text-gray-600">Activity Type: {activity.type}</p>
              <p className="text-sm text-gray-600">
                Due Date: {activity.dueDate ? new Date(activity.dueDate).toLocaleString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Course: {activity.course}</p>
              <p
                className={`font-semibold ${
                  activity.status === 'Pending'
                    ? 'text-yellow-600'
                    : activity.status === 'Done'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                Status: {activity.status}
              </p>
            </div>

            <div>
              <button
                onClick={() => editActivity(activity)}
                className="mr-3 text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => deleteActivity(activity._id)}
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
