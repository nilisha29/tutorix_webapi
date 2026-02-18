"use client";

export default function TutorEarningsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Earnings & Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Earnings" value="$0.00" icon="💰" />
        <StatCard title="Pending Payouts" value="$0.00" icon="⏳" />
        <StatCard title="Completed Sessions" value="0" icon="✅" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">💳 No payment history yet</p>
          <p className="text-gray-400 mt-2">
            Payments will appear here as you complete sessions with students
          </p>
        </div>
      </div>

      {/* Future implementation can include:
        - Payout history table
        - Filter by date range
        - Download invoice
        - Set payout method
        - View payment status
      */}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}
