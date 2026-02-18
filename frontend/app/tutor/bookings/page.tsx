"use client";

export default function TutorBookingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-8">My Bookings</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">📅 No bookings yet</p>
          <p className="text-gray-400 mt-2">
            Your bookings will appear here once students schedule sessions with you
          </p>
        </div>
      </div>

      {/* Future implementation can include:
        - List of upcoming bookings
        - Filter by date/status
        - Accept/reject booking requests
        - Mark sessions as completed
        - Student details
      */}
    </div>
  );
}
