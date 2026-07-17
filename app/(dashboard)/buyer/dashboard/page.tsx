"use client";

import { useSession } from "@/app/lib/auth-client";
import {
  Package,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

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
          value="24"
          change="+12%"
          trend="up"
          icon={<Package className="w-5 h-5" />}
        />
        <StatCard
          label="Total Spent"
          value="$2,847.50"
          change="+8.3%"
          trend="up"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <StatCard
          label="Rewards Points"
          value="1,250"
          change="+5.1%"
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Order Activity - circular progress */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 transition-colors">
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
                  className="dark:stroke-white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${0.92 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#1a1a1a] dark:text-white transition-colors">
                  92%
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1a1a1a] dark:bg-white" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Delivered</span>
                <span className="text-xs font-semibold text-[#1a1a1a] dark:text-white ml-auto">22</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Pending</span>
                <span className="text-xs font-semibold text-[#1a1a1a] dark:text-white ml-auto">2</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 mt-4">
            Deviation Index <span className="font-semibold text-[#1a1a1a] dark:text-white">2%</span>
          </p>
        </div>

        {/* Spending Summary */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 transition-colors">
          <h3 className="text-sm font-semibold text-[#1a1a1a] dark:text-white mb-1 transition-colors">
            Recent Orders
          </h3>
          <p className="text-[11px] text-neutral-400 mb-5">Your latest purchases</p>

          <div className="flex flex-col gap-3">
            <OrderRow
              name="Premium Wireless Headphones"
              date="Jul 15, 2026"
              amount="$149.99"
              status="delivered"
            />
            <OrderRow
              name="Smart Watch Pro"
              date="Jul 12, 2026"
              amount="$299.00"
              status="delivered"
            />
            <OrderRow
              name="Leather Crossbody Bag"
              date="Jul 10, 2026"
              amount="$89.50"
              status="pending"
            />
            <OrderRow
              name="Running Shoes V2"
              date="Jul 08, 2026"
              amount="$124.99"
              status="delivered"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Shopping Summary Card */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f5f0eb] dark:bg-[#2a2a2a] flex items-center justify-center transition-colors">
              <ShoppingCart className="w-6 h-6 text-[#1a1a1a] dark:text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white transition-colors">
                $2,847
              </p>
              <p className="text-[11px] text-neutral-400">Total lifetime spending</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 transition-colors">
            You&apos;ve placed <span className="font-semibold text-[#1a1a1a] dark:text-white">24 orders</span> since joining NovaCart.
          </p>
        </div>

        {/* Membership Card */}
        <div className="bg-[#1a1a1a] dark:bg-white rounded-2xl p-6 flex items-center gap-6 transition-colors">
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
  change,
  trend,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400 transition-colors">
          {label}
        </p>
        <div className="w-8 h-8 rounded-lg bg-[#f5f0eb] dark:bg-[#2a2a2a] flex items-center justify-center text-[#1a1a1a] dark:text-white transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
        {value}
      </p>
      <div className="flex items-center gap-1 mt-2">
        {trend === "up" ? (
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
        )}
        <span
          className={`text-[11px] font-medium ${
            trend === "up" ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
        <span className="text-[11px] text-neutral-400 ml-0.5">than last month</span>
      </div>
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
  status: "delivered" | "pending";
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            status === "delivered"
              ? "bg-emerald-50 dark:bg-emerald-900/20"
              : "bg-amber-50 dark:bg-amber-900/20"
          }`}
        >
          {status === "delivered" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <Clock className="w-4 h-4 text-amber-500" />
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
