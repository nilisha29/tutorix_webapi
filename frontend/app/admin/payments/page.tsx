"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllBookingsForAdmin } from "@/lib/api/booking";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllBookingsForAdmin();
        const rows = Array.isArray(result?.data) ? result.data : [];
        setPayments(rows);
      } catch (err: Error | any) {
        setError(err.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return payments;

    return payments.filter((item) => {
      const student = String(item.studentId?.fullName || item.studentId?.username || "").toLowerCase();
      const tutor = String(item.tutorId?.fullName || item.tutorId?.username || "").toLowerCase();
      const method = String(item.paymentMethod || "").toLowerCase();
      const status = String(item.paymentStatus || "").toLowerCase();
      const amount = String(item.amount || "").toLowerCase();
      return (
        student.includes(term) ||
        tutor.includes(term) ||
        method.includes(term) ||
        status.includes(term) ||
        amount.includes(term)
      );
    });
  }, [payments, searchQuery]);

  const summary = useMemo(() => {
    const paidRows = payments.filter((item) => item.paymentStatus === "paid");
    const pendingRows = payments.filter((item) => item.paymentStatus === "pending");
    const failedRows = payments.filter((item) => item.paymentStatus === "failed");

    const totalPaidAmount = paidRows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalPendingAmount = pendingRows.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      paidCount: paidRows.length,
      pendingCount: pendingRows.length,
      failedCount: failedRows.length,
      totalPaidAmount,
      totalPendingAmount,
    };
  }, [payments]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [currentPage, filteredPayments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-blue-600">Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Paid Payments</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{summary.paidCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Pending Payments</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{summary.pendingCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Failed Payments</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{summary.failedCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Total Paid Amount</p>
          <p className="text-2xl font-bold text-green-700 mt-1">Rs {summary.totalPaidAmount.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Total Pending Amount</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">Rs {summary.totalPendingAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by student, tutor, payment method, status or amount"
          className="w-full md:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
      </div>

      {loading && <p className="text-gray-500">Loading payments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredPayments.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          No payments found.
        </div>
      )}

      {!loading && !error && filteredPayments.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Tutor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Payment Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Booking Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPayments.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.studentId?.fullName || "Student"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.tutorId?.fullName || "Tutor"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.paymentMethod || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.paymentStatus || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.bookingStatus || "-"}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">Rs {item.amount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredPayments.length)} of {filteredPayments.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
