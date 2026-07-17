"use client";

import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

const orders = [
  {
    id: "NC-20260715-001",
    date: "Jul 15, 2026",
    items: "Premium Wireless Headphones × 1",
    total: "$149.99",
    status: "delivered" as const,
  },
  {
    id: "NC-20260712-002",
    date: "Jul 12, 2026",
    items: "Smart Watch Pro × 1",
    total: "$299.00",
    status: "delivered" as const,
  },
  {
    id: "NC-20260710-003",
    date: "Jul 10, 2026",
    items: "Leather Crossbody Bag × 1, Wallet × 1",
    total: "$139.50",
    status: "shipped" as const,
  },
  {
    id: "NC-20260708-004",
    date: "Jul 08, 2026",
    items: "Running Shoes V2 × 1",
    total: "$124.99",
    status: "delivered" as const,
  },
  {
    id: "NC-20260705-005",
    date: "Jul 05, 2026",
    items: "Noise Cancelling Earbuds × 2",
    total: "$179.98",
    status: "delivered" as const,
  },
  {
    id: "NC-20260630-006",
    date: "Jun 30, 2026",
    items: "Graphic Tee × 3",
    total: "$74.97",
    status: "cancelled" as const,
  },
  {
    id: "NC-20260625-007",
    date: "Jun 25, 2026",
    items: "Denim Jacket × 1",
    total: "$189.00",
    status: "delivered" as const,
  },
  {
    id: "NC-20260620-008",
    date: "Jun 20, 2026",
    items: "Sunglasses × 1, Cap × 1",
    total: "$115.00",
    status: "pending" as const,
  },
];

const statusConfig = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
            Order History
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">
            Track and manage your past purchases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-neutral-400" />
          <span className="text-sm font-medium text-[#1a1a1a] dark:text-white transition-colors">
            {orders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden transition-colors">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-3.5 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Order ID
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Date
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Items
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Total
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Status
          </span>
        </div>

        {/* Table Rows */}
        {orders.map((order) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;
          return (
            <div
              key={order.id}
              className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_2fr_1fr_1fr] gap-2 sm:gap-4 px-6 py-4 border-b border-neutral-50 dark:border-neutral-800/50 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors"
            >
              {/* Order ID */}
              <div className="flex items-center">
                <span className="text-[13px] font-medium text-[#1a1a1a] dark:text-white transition-colors">
                  {order.id}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center">
                <span className="text-[13px] text-neutral-500 dark:text-neutral-400 transition-colors">
                  {order.date}
                </span>
              </div>

              {/* Items */}
              <div className="flex items-center">
                <span className="text-[13px] text-neutral-600 dark:text-neutral-300 truncate transition-colors">
                  {order.items}
                </span>
              </div>

              {/* Total */}
              <div className="flex items-center">
                <span className="text-[13px] font-semibold text-[#1a1a1a] dark:text-white transition-colors">
                  {order.total}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
                  <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                  <span className={`text-[11px] font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
