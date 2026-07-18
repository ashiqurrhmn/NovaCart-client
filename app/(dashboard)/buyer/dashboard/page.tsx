"use client";

import { authClient, useSession } from "@/app/lib/auth-client";
import {
  Package,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: any[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const { data: tokenData } = await authClient.token();
          const jwtToken = tokenData?.token;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl}/orders/${session.user.id}`, {
            headers: {
              "Authorization": `Bearer ${jwtToken}`
            }
          });
          const data = await res.json();
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders", error);
          toast.error("Failed to load dashboard data");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    if (session?.user?.id) {
        fetchOrders();
    } else if (session === null) {
        setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900 dark:text-white" />
        <span className="text-sm text-neutral-500">Loading dashboard...</span>
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const rewardsPoints = Math.floor(totalSpent * 2.5); // Example: 2.5 points per dollar
  
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = totalOrders - deliveredOrders;
  const completionRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(completionRate / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Orders"
          value={totalOrders.toString()}
          icon={<Package className="w-5 h-5" />}
        />
        <StatCard
          label="Total Spent"
          value={`$${totalSpent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          icon={<CreditCard className="w-5 h-5" />}
        />
        <StatCard
          label="Rewards Points"
          value={rewardsPoints.toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Order Activity - circular progress */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 transition-colors border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1a1a1a] dark:text-white mb-1 transition-colors">
            Order Completion
          </h3>
          <p className="text-[11px] text-neutral-400 mb-6">Your order fulfillment rate</p>

          <div className="flex items-center gap-8">
            {/* Circular Progress */}
            <div className="relative w-[140px] h-[140px] shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  className="text-neutral-100 dark:text-neutral-800"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#1a1a1a"
                  className="dark:stroke-white transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#1a1a1a] dark:text-white transition-colors">
                  {completionRate}%
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1a1a1a] dark:bg-white" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Delivered</span>
                <span className="text-xs font-semibold text-[#1a1a1a] dark:text-white ml-auto">{deliveredOrders}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Pending</span>
                <span className="text-xs font-semibold text-[#1a1a1a] dark:text-white ml-auto">{pendingOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Summary */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 transition-colors border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1a1a1a] dark:text-white mb-1 transition-colors">
            Recent Orders
          </h3>
          <p className="text-[11px] text-neutral-400 mb-5">Your latest purchases</p>

          <div className="flex flex-col gap-3">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <OrderRow
                  key={order._id}
                  name={`Order #${order._id.substring(0, 8)}`}
                  date={new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  amount={`$${(order.totalAmount || 0).toFixed(2)}`}
                  status={order.status}
                />
              ))
            ) : (
              <div className="text-sm text-neutral-500 py-4 text-center">No recent orders.</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shopping Summary Card */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 transition-colors border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center transition-colors">
              <ShoppingCart className="w-6 h-6 text-[#1a1a1a] dark:text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white transition-colors">
                ${totalSpent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
              <p className="text-[11px] text-neutral-400">Total lifetime spending</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 transition-colors">
            You&apos;ve placed <span className="font-semibold text-[#1a1a1a] dark:text-white">{totalOrders} {totalOrders === 1 ? 'order' : 'orders'}</span> since joining NovaCart.
          </p>
        </div>

        {/* Membership Card */}
        <div className="bg-[#1a1a1a] dark:bg-white rounded-2xl p-6 flex items-center gap-6 transition-colors shadow-sm">
          <div className="shrink-0">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400 dark:text-neutral-500 mb-1">
              NOVACART
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white dark:text-[#1a1a1a] leading-tight transition-colors">
              Premium<br />Member
            </p>
          </div>
          <div className="flex-1 text-right">
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Enjoy free shipping on all orders and exclusive early access to new arrivals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 transition-colors border border-neutral-100 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400 transition-colors">
          {label}
        </p>
        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#1a1a1a] dark:text-white transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
        {value}
      </p>
    </div>
  );
}

function OrderRow({
  name,
  date,
  amount,
  status,
}: {
  name: string;
  date: string;
  amount: string;
  status: string;
}) {
  const isDelivered = status === "delivered";
  
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isDelivered
              ? "bg-neutral-100 dark:bg-neutral-800"
              : "bg-neutral-50 dark:bg-neutral-900/50"
          }`}
        >
          {isDelivered ? (
            <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white" />
          ) : (
            <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#1a1a1a] dark:text-white truncate transition-colors">
            {name}
          </p>
          <p className="text-[11px] text-neutral-400">{date}</p>
        </div>
      </div>
      <p className="text-[13px] font-semibold text-[#1a1a1a] dark:text-white shrink-0 ml-4 transition-colors">
        {amount}
      </p>
    </div>
  );
}
