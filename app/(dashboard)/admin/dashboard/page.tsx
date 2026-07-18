"use client";

import { useEffect, useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, Package, ShoppingBag, Users, Loader2, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const COLORS = ['#222222', '#555555', '#888888', '#bbbbbb', '#dddddd'];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0
  });
  
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch(`${apiUrl}/admin/orders`),
          fetch(`${apiUrl}/products`),
          fetch(`${apiUrl}/users`)
        ]);

        const orders = await ordersRes.json();
        const products = await productsRes.json();
        const users = await usersRes.json();

        // 1. Total Stats Calculation
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          products: products.length,
          users: users.length
        });

        // 2. Revenue Over Last 7 Days
        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            dateObj: d,
            revenue: 0
          };
        }).reverse();

        orders.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          const dayObj = last7Days.find(d => 
            d.dateObj.getDate() === orderDate.getDate() && 
            d.dateObj.getMonth() === orderDate.getMonth() &&
            d.dateObj.getFullYear() === orderDate.getFullYear()
          );
          if (dayObj) {
            dayObj.revenue += (order.totalAmount || 0);
          }
        });
        setRevenueData(last7Days.map(d => ({ date: d.date, revenue: Number(d.revenue.toFixed(2)) })));

        // 3. Orders by Status
        const statusCounts = orders.reduce((acc: any, order: any) => {
          const status = order.status || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const formattedStatusData = Object.keys(statusCounts).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: statusCounts[key]
        }));
        setStatusData(formattedStatusData);

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900 dark:text-white" />
        <span className="text-sm text-neutral-500">Loading dashboard...</span>
      </div>
    );
  }

  const statCards = [
    { label: "Total Revenue", value: `$${stats.revenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: DollarSign, color: "text-neutral-900 dark:text-white", bg: "bg-neutral-100 dark:bg-neutral-800" },
    { label: "Total Orders", value: stats.orders.toString(), icon: ShoppingBag, color: "text-neutral-900 dark:text-white", bg: "bg-neutral-100 dark:bg-neutral-800" },
    { label: "Total Products", value: stats.products.toString(), icon: Package, color: "text-neutral-900 dark:text-white", bg: "bg-neutral-100 dark:bg-neutral-800" },
    { label: "Total Users", value: stats.users.toString(), icon: Users, color: "text-neutral-900 dark:text-white", bg: "bg-neutral-100 dark:bg-neutral-800" },
  ];

  return (
    <div className="flex flex-col gap-6 pt-4 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Welcome back! Here's an overview of your store's performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold text-[#1a1a1a] dark:text-white">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="min-w-0 lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-neutral-900 dark:text-white" />
            <h2 className="text-lg font-bold text-[#1a1a1a] dark:text-white">Revenue (Last 7 Days)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#888888" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#888888" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#888' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#888888" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="min-w-0 bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors">
          <h2 className="text-lg font-bold text-[#1a1a1a] dark:text-white mb-6">Orders by Status</h2>
          <div className="h-[300px] w-full flex flex-col items-center justify-center relative">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-neutral-500">No orders yet</div>
            )}
            
            {/* Inner text for Pie chart */}
            {statusData.length > 0 && (
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Total</span>
                <span className="text-xl font-bold text-[#1a1a1a] dark:text-white">{stats.orders}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
