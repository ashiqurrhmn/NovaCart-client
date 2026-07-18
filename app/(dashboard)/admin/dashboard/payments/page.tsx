"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus?: string;
  paymentIntentId?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/orders`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-500 mt-20 flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
        <p className="text-sm">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
            Payment History
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">
            View all customer transactions and payments
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm shrink-0 transition-colors">
          <CreditCard className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white transition-colors">
            {payments.length} <span className="text-neutral-500 dark:text-neutral-400 font-medium">transactions</span>
          </span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden transition-colors border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
                Transaction ID
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
                Customer
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
                Date & Time
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
                Amount
              </span>
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
                Status
              </span>
            </div>

            {/* Table Rows */}
            {payments.length === 0 ? (
              <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                <CreditCard className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-4" />
                <p className="text-base font-medium text-[#1a1a1a] dark:text-white mb-1">No payments found</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  There are no transactions in the system yet.
                </p>
              </div>
            ) : (
              payments.map((payment) => {
                const dateStr = new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div
                    key={payment._id}
                    className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors items-center"
                  >
                    {/* Transaction ID */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-mono font-medium text-neutral-700 dark:text-neutral-300 transition-colors truncate" title={payment.paymentIntentId || payment._id}>
                        {payment.paymentIntentId || `order_${payment._id.substring(0, 8)}`}
                      </span>
                    </div>

                    {/* Customer */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {payment.userImage ? (
                          <img src={payment.userImage} alt="User" className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-[#1a1a1a] shadow-sm" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-[#1a1a1a] shadow-sm">
                            <span className="text-[13px] text-indigo-700 dark:text-indigo-300 font-bold">
                              {payment.userName ? payment.userName.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-semibold text-[#1a1a1a] dark:text-white truncate">
                            {payment.userName || 'Guest User'}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                            {payment.userEmail || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors">
                        {dateStr}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-bold text-[#1a1a1a] dark:text-white transition-colors">
                        ${(payment.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col min-w-0 items-start">
                      {payment.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Paid
                        </span>
                      ) : payment.paymentStatus === 'refunded' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          Refunded
                        </span>
                      ) : payment.paymentStatus === 'failed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-600 dark:text-neutral-300 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                          {payment.paymentStatus || 'Pending'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
