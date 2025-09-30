'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import { EventInput, EventClickArg } from '@fullcalendar/core/index.js';
type Activity = {
  _id: string;
  title: string;
  dueDate: string;
  course: string;
  status: 'Pending' | 'Done' | 'Overdue';
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
  const [selected, setSelected] = useState<Activity | null>(null);

  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data: Activity[]) => {
        const mapped = data.map((a) => {
          const bgColor =
            a.status === 'Pending' ? 'gold' :
            a.status === 'Done' ? 'green' :
            'red';

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
  setSelected(info.event.extendedProps as Activity); 
  setModalOpen(true);
};
  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  return (
    <>
      <style>{`
        .fc .fc-col-header-cell {
          background-color: #2563eb; /* Tailwind blue-600 */
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
      `}</style>

      {/* Responsive container with horizontal scroll on very small screens */}
      <div className="p-4 rounded-lg shadow-md max-w-full overflow-x-auto">
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
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
              aria-label="Close modal"
              style={{ lineHeight: 1 }}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-blue-600 mb-4 truncate">
              📘 {selected.title}
            </h2>

            <div className="space-y-4 text-gray-800 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                    ${selected.status === 'Pending' && 'bg-yellow-200 text-yellow-800'}
                    ${selected.status === 'Done' && 'bg-green-200 text-green-800'}
                    ${selected.status === 'Overdue' && 'bg-red-200 text-red-800'}
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
                <span className="text-gray-500">{getTimeLeft(selected.dueDate)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Course:</span>
                <span className="font-semibold">{selected.course}</span>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="bg-gray-100 hover:bg-gray-200 text-sm px-5 py-2 rounded"
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
