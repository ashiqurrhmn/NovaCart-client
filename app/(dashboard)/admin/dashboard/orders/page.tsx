"use client";

import { Package, ChevronDown, ChevronUp, MapPin, User, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderItem {
  name: string;
  quantity: number;
}

interface DeliveryAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

interface Order {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  deliveryAddress?: DeliveryAddress;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        toast.success("Order status updated");
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("An error occurred while updating status");
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Loading orders...</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
            Manage Orders
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">
            View all orders and update their statuses
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
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1.5fr_1fr_1.5fr_1fr_1fr_1.5fr_40px] gap-4 px-6 py-3.5 border-b border-neutral-100 dark:border-neutral-800 items-center">
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Order ID
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Customer
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
            Payment
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
            Update Status
          </span>
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400 text-right w-10">
            Details
          </span>
        </div>

        {/* Table Rows */}
        {orders.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No orders found.
          </div>
        ) : (
          orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
            
            // Map legacy 'paid' status to 'processing'
            let currentStatus = order.status === "paid" ? "processing" : order.status;
            const isUnknownStatus = !statusOptions.find(o => o.value === currentStatus);
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="flex flex-col border-b border-neutral-50 dark:border-neutral-800/50 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="grid grid-cols-[1fr_1.5fr_1fr_1.5fr_1fr_1fr_1.5fr_40px] gap-4 px-6 py-4 items-center">
                  {/* Order ID */}
                  <div className="flex items-center">
                    <span className="text-[13px] font-medium text-[#1a1a1a] dark:text-white transition-colors truncate pr-2" title={order._id}>
                      {order._id.substring(0, 8)}...
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-2 overflow-hidden">
                    {order.userImage ? (
                      <img src={order.userImage} alt="User" className="w-6 h-6 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold">
                          {order.userName ? order.userName.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-medium text-[#1a1a1a] dark:text-white truncate">
                        {order.userName || 'Guest User'}
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                        {order.userEmail || 'N/A'}
                      </span>
                    </div>
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

                  {/* Payment Status */}
                  <div className="flex items-center">
                    {order.paymentStatus ? (
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800">
                        N/A
                      </span>
                    )}
                  </div>

                  {/* Update Status Dropdown */}
                  <div className="flex items-center">
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-[13px] font-medium text-[#1a1a1a] dark:text-white bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md p-1.5 outline-none w-full max-w-[140px] cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-neutral-400 dark:focus:border-neutral-600"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      {isUnknownStatus && (
                        <option value={currentStatus} disabled className="capitalize">
                          {currentStatus}
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Expand Toggle */}
                  <div className="flex justify-end pr-2">
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-6 py-5 bg-neutral-50/80 dark:bg-[#151515] border-t border-neutral-100 dark:border-neutral-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Customer Info Card */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
                          Customer Details
                        </h4>
                        <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                          {order.userImage ? (
                            <img src={order.userImage} alt="User" className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-neutral-50 dark:ring-neutral-800" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                              <User className="w-5 h-5 text-indigo-500" />
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-bold text-[#1a1a1a] dark:text-white">
                              {order.userName || 'Guest User'}
                            </span>
                            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="text-[12px]">{order.userEmail || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 mt-0.5">
                              <span className="text-[11px] font-medium px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">User ID</span>
                              <span className="text-[11px] font-mono">{order._id || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address Card */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
                          Delivery Address
                        </h4>
                        <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl shadow-sm">
                          {order.deliveryAddress ? (
                            <div className="flex flex-col gap-2.5">
                              <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                <span className="text-[13px] font-medium text-[#1a1a1a] dark:text-white">
                                  {order.deliveryAddress.name}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                  <span className="text-[13px] text-[#1a1a1a] dark:text-white">
                                    {order.deliveryAddress.street}
                                  </span>
                                  <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                                  {order.deliveryAddress.phone || 'N/A'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-4 text-sm text-neutral-500">
                              No delivery address provided.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

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
