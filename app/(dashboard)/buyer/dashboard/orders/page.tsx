"use client";

import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authClient, useSession } from "@/app/lib/auth-client";

interface OrderItem {
  name: string;
  quantity: number;
}
interface Order {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  status: "delivered" | "shipped" | "pending" | "cancelled" | "paid" | "processing";
}

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
  processing: {
    label: "Processing",
    icon: RefreshCw,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const { data: tokenData } = await authClient.token();
          const jwtToken = tokenData?.token;
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${session.user.id}`, {
            headers: {
              "Authorization": `Bearer ${jwtToken}`
            }
          });
          const data = await res.json();
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders", error);
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
    return <div className="p-8 text-center text-neutral-500">Loading orders...</div>;
  }

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
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden transition-colors border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.2fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-3.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
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
        {orders.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No orders found.
          </div>
        ) : (
          orders.map((order) => {
            const mappedStatus = order.status === "paid" ? "processing" : order.status;
            const config = statusConfig[mappedStatus as keyof typeof statusConfig] || statusConfig.processing || statusConfig.pending;
            const StatusIcon = config.icon;
            
            const itemsStr = order.items?.map(item => `${item.name} × ${item.quantity}`).join(', ') || 'No items';
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });

            return (
              <div
                key={order._id}
                className="grid grid-cols-[1.2fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-4 border-b border-neutral-50 dark:border-neutral-800/50 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors items-center"
              >
                {/* Order ID */}
                <div className="flex items-center">
                  <span className="text-[13px] font-medium text-[#1a1a1a] dark:text-white transition-colors truncate pr-2">
                    {order._id}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center">
                  <span className="text-[13px] text-neutral-500 dark:text-neutral-400 transition-colors">
                    {dateStr}
                  </span>
                </div>

                {/* Items */}
                <div className="flex items-center">
                  <select 
                    className="text-[13px] text-neutral-600 dark:text-neutral-300 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md p-1.5 outline-none w-full max-w-[160px] cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                    defaultValue=""
                  >
                    <option value="" disabled>{order.items?.length || 0} Item{order.items?.length !== 1 ? 's' : ''}</option>
                    {order.items?.map((item, idx) => (
                      <option key={idx} value={idx}>
                        {item.name} × {item.quantity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total */}
                <div className="flex items-center">
                  <span className="text-[13px] font-semibold text-[#1a1a1a] dark:text-white transition-colors">
                    ${(order.totalAmount || 0).toFixed(2)}
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
          })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
