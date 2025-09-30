'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip, 
  Legend,
  ArcElement,
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Course {
  _id: string;
  title: string;
  progress: number;
}

interface Assignment {
  _id: string;
  title: string;
  instructor: string;
  dueDate: string;
  totalMarks: string;
  obtainedMarks?: string;
}

interface Activity {
  _id: string;
  title: string;
  type: string;
  dueDate: string;
  status: 'Pending' | 'Done' | 'Overdue';
  course: string;
}

interface Props {
  courses: Course[];
  assignments: Assignment[];
  activities: Activity[];
}

export default function ChartSection({ courses, assignments, activities }: Props) {
  // Bar Chart for Course Progress
  const courseData = {
    labels: courses.map((c) => c.title),
    datasets: [
      {
        label: 'Progress (%)',
        data: courses.map((c) => c.progress),
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue-500
      },
    ],
  };

  const courseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Progress by Course',
        font: { size: 18 },
        color: '#1e3a8a',
      },
      tooltip: {
      callbacks: {
       label: (ctx: TooltipItem<'bar'>) => `${ctx.raw}% complete`,
      },
     },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#334155',
        },
      },
      x: {
        ticks: {
          color: '#334155',
        },
      },
    },
  };

  // Pie Chart for Assignment Performance
  const assignmentData = {
    labels: assignments.map((a) => a.title),
    datasets: [
      {
        label: 'Obtained Marks',
        data: assignments.map((a) => Number(a.obtainedMarks || 0)),
        backgroundColor: assignments.map(
          (_, i) => `hsl(${(i * 50) % 360}, 70%, 60%)`
        ),
      },
    ],
  };

  const assignmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#475569',
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Marks Obtained by Assignment',
        font: { size: 18 },
        color: '#7e22ce',
      },
    },
  };

  // Donut Chart for Activity Type Count
  const activityTypeCount: Record<string, number> = {};
  activities.forEach((a: Activity) => {
    activityTypeCount[a.type] = (activityTypeCount[a.type] || 0) + 1;
  });

  const donutColors = Object.keys(activityTypeCount).map((_, i) =>
    `hsl(${(i * 60) % 360}, 70%, 60%)`
  );

  const activityData = {
    labels: Object.keys(activityTypeCount),
    datasets: [
      {
        label: 'Activity Count',
        data: Object.values(activityTypeCount),
        backgroundColor: donutColors,
      },
    ],
  };

  const activityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#000000',
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Activity Type Distribution',
        font: { size: 18 },
        color: '#000000',
      },
    },
    cutout: '50%',
  };

  return (
  
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-10">
      {/* Course Progress Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <h3 className="text-lg font-semibold text-black mb-4">📊 Course Progress</h3>
        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
          <Bar data={courseData} options={courseOptions} />
        </div>
      </div>

      {/* Assignment Marks Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <h3 className="text-lg font-semibold text-black mb-4">🏆 Assignment Marks</h3>
        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
          <Pie data={assignmentData} options={assignmentOptions} />
        </div>
      </div>

      {/* Activity Types Donut Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col col-span-full xl:col-span-1">
        <h3 className="text-lg font-semibold text-black mb-4">📌 Activity Breakdown</h3>
        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 mx-auto">
          <Pie data={activityData} options={activityOptions} />
        </div>
      </div>
    </div>
  </div>


  );
}
