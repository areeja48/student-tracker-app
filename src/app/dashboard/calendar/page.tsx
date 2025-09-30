'use client';
import AssignmentCalendar from '@/components/AssignmentCalendar';
import ActivityCalendar from '@/components/ActivityCalendar';

export default function CalendarPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
    
        {/* Assignment Calendar */}
    
          <h2 className="text-2xl font-semibold mb-4">📅 Assignment Calendar</h2>
          <AssignmentCalendar />
       

        {/* Activity Calendar */}
       
          <h2 className="text-2xl font-semibold mt-8 mb-4">📅 Activities Calendar</h2>
          <ActivityCalendar />
     
 
    </div>
  );
}
