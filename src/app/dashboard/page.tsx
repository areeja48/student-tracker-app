'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';


interface Course {
  _id: string;
  title: string;
  instructor: string;
  progress: number;
}

interface Assignment {
  _id: string;
  title: string;
  instructor: string;
  dueDate: string;
  totalMarks: string;
  obtainedMarks: string;
}

interface Activity {
 _id: string;
 title: string;
 type: string;
 dueDate: string;
 status: string;
 course: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      // Fetch all user data
      Promise.all([
        fetch('/api/courses').then((res) => res.json()),
        fetch('/api/assignments').then((res) => res.json()),
        fetch('/api/activities').then((res) => res.json()),
      ])
        .then(([coursesData, assignmentsData, activityData]) => {
          
            setCourses(coursesData || []);
          console.log("coursesData:", coursesData); 
 
          setAssignments(assignmentsData || []);
          setActivities(activityData || []);
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader/>
      </div>
    );
  }

  return (
    
    /*<div className="min-h-screen bg-gradient-to-tr  from-blue-100 to-purple-200 text-gray-800  dark:bg-black p-8">*/
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">

        {/* Main content grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left sidebar - Account Details */}
          <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Account Details</h2>
            <p className="mb-3 text-gray-900"><span className="font-semibold">Name:</span> {session?.user?.name}</p>
            <p className="text-gray-900"><span className="font-semibold">Email:</span> {session?.user?.email}</p>
          </div>

          {/* Center - Course Progress */}
          <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">🎯 Course Progress</h2>
            {courses.length === 0 ? (
              <p className="text-gray-700 font-medium">No courses found.</p>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="mb-6">
                  <div className="flex justify-between mb-1 text-gray-900 font-semibold">
                    <span>{course.title}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-5">
                    <div
                      className="bg-blue-700 h-5 rounded-full transition-all duration-700"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
                                  
          {/* Right Sidebar */}
          <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 shadow-sm">
            {/* Upcoming Assignments */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📅 Upcoming Assignments</h2>
            {assignments.length === 0 ? (
              <p className="text-gray-600 mb-10 font-medium">No upcoming assignments 🎉</p>
            ) : (
              <ul className="space-y-3 mb-10 text-gray-900 font-medium">
                {assignments.map((assignment) => (
                  <li key={assignment._id} className="leading-snug">
                    <span>{assignment.title}</span>
                    <br />
                    <span className="text-sm text-gray-600 font-normal">Due Date: {assignment.dueDate}</span>
                  </li>
                ))}
              </ul>
            )}


            
          </div>

          {/* Recent Activity */}
            <div className='bg-gray-100 p-6 rounded-xl border border-gray-300 shadow-sm md:col-span-2'>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Recent Activity</h2>
            {activities.length === 0 ? (
              <p className="text-gray-600 font-medium">No recent activities.</p>
            ) : (
              <ul className="list-disc list-inside text-gray-900 font-medium space-y-2">
                {activities.map((activity) => (
                    <li key={activity._id} className="leading-snug">
                    <span>{activity.title}</span>
                    <br />
                    <span className="text-sm text-gray-600 font-normal">Due Date: {activity.dueDate}</span>
                  </li>
                ))}
              </ul>
            )}
            </div>
        </div>

        


            {/* Management Section */}
<div className="p-8 mt-10 bg-gray-50 border-t border-gray-300 rounded-xl">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">⚙️ Manage Content</h2>
  <div className="flex gap-6 flex-wrap">
    <button
      onClick={() => router.push('/dashboard/courses')}
      className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
    >
      📚 Manage Courses
    </button>
    <button
      onClick={() => router.push('/dashboard/assignments')}
      className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
    >
      📝 Manage Assignments
    </button>
    <button
      onClick={() => router.push('/dashboard/activities')} 
      className="bg-green-700 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md transition font-semibold"
    >
      📝 Manage Activities
    </button>
  </div>
</div>


        {/* Footer */}
        <div className="p-6 border-t text-center text-gray-600 text-sm select-none">
          Need help? Contact support or visit the FAQ.
        </div>
      </div>
    /*</div>*/
  );
}
