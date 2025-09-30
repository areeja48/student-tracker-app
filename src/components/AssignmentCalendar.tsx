'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import { EventInput, EventClickArg } from '@fullcalendar/core';
type Assignment = {
  _id: string;
  title: string;
  instructor: string;
  dueDate: string;
  totalMarks: string;
  obtainedMarks?: string;
  status: 'Pending' | 'Submitted' | 'Overdue';
};

function getTimeLeft(dateStr: string) {
  const due = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = due - now;

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return `${days}d ${remainingHours}h left`;
}

export default function CalendarView() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);

  useEffect(() => {
    fetch('/api/assignments')
      .then((res) => res.json())
      .then((data: Assignment[]) => {
        const mapped = data.map((a) => {
          const bgColor =
            a.status === 'Pending'
              ? 'gold'
              : a.status === 'Submitted'
              ? 'green'
              : 'red';

          return {
            id: a._id,
            title: a.title,
            start: new Date(a.dueDate).toISOString(),
            backgroundColor: bgColor,
            borderColor: bgColor,
            extendedProps: a,
          };
        });
        setEvents(mapped);
      });
  }, []);

const onEventClick = (info: EventClickArg) => {
  setSelected(info.event.extendedProps as Assignment);
  setModalOpen(true);
};

  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  return (
    <>
      {/* Tailwind-based FullCalendar dark/light overrides */}
      <style jsx global>{`
        /* LIGHT MODE STYLES */
        .fc {
          background-color: white;
          color: #1f2937; /* gray-800 */
        }

        .fc .fc-col-header-cell {
          background-color: #2563eb; /* blue-600 */
          color: white;
          font-weight: 600;
        }

        .fc .fc-daygrid-day {
          background-color: #eff6ff; /* blue-100 */
        }

        .fc .fc-daygrid-day-number {
          color: #2563eb; /* blue-600 */
          font-weight: 600;
        }

        .fc .fc-daygrid-day:hover {
          background-color: #bfdbfe; /* blue-200 */
          cursor: pointer;
        }

        /* DARK MODE STYLES */
        .dark .fc {
          background-color: #1f2937; /* gray-800 */
          color: #e5e7eb; /* gray-200 */
        }

        .dark .fc .fc-col-header-cell {
          background-color: #111827; /* gray-900 */
          color: #f9fafb; /* gray-50 */
        }

        .dark .fc .fc-daygrid-day {
          background-color: #374151; /* gray-700 */
        }

        .dark .fc .fc-daygrid-day-number {
          color: #f9fafb; /* gray-50 */
        }

        .dark .fc .fc-daygrid-day:hover {
          background-color: #4b5563; /* gray-600 */
        }

        .dark .fc-event {
          background-color: #2563eb !important; /* blue-600 */
          border-color: #2563eb !important;
          color: white !important;
        }
      `}</style>

      <div className="p-4 rounded-lg shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          eventClick={onEventClick}
        />
      </div>

      {/* Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-tr bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
              📘 {selected.title}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    selected.status === 'Pending' &&
                    'bg-yellow-200 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900'
                  }
                  ${
                    selected.status === 'Submitted' &&
                    'bg-green-200 text-green-800 dark:bg-green-300 dark:text-green-900'
                  }
                  ${
                    selected.status === 'Overdue' &&
                    'bg-red-200 text-red-800 dark:bg-red-300 dark:text-red-900'
                  }
                `}
                >
                  {selected.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Due Date:</span>
                <span>{new Date(selected.dueDate).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Time Left:</span>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {getTimeLeft(selected.dueDate)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Instructor:</span>
                <a
                  href={`mailto:${selected.instructor}@university.edu`}
                  className="text-blue-600 underline dark:text-blue-400"
                >
                  {selected.instructor}
                </a>
              </div>

              <div className="mt-4">
                <p className="font-semibold mb-1">Marks Progress:</p>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      selected.obtainedMarks
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{
                      width: selected.obtainedMarks
                        ? `${
                            (Number(selected.obtainedMarks) /
                              Number(selected.totalMarks)) *
                            100
                          }%`
                        : '0%',
                    }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                  {selected.obtainedMarks
                    ? `${selected.obtainedMarks} / ${selected.totalMarks}`
                    : `Not yet graded`}
                </p>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 text-sm px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
