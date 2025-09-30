'use client';

import { useEffect, useState } from 'react';
import ChartSection from '@/components/ChartSection';

export default function ProgressPage() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const coursesRes = await fetch('/api/courses');
        const assignmentsRes = await fetch('/api/assignments');
        const activitiesRes = await fetch('/api/activities');

        setCourses(await coursesRes.json());
        setAssignments(await assignmentsRes.json());
        setActivities(await activitiesRes.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading charts...</p>;

  return (
    <div className="p-6 ml-64">
      <h1 className="text-3xl font-bold text-white-800 mb-6">📈 Your Progress</h1>
      <ChartSection
        courses={courses}
        assignments={assignments}
        activities={activities}
      />
    </div>
  );
}
