import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const StatCard = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  const changeColor = isPositive? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const Arrow = isPositive? '▲' : '▼';

  return (
    <div className={`rounded-2xl p-6 shadow-lg ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {change!== undefined && (
        <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${changeColor}`}>
          <span>{Arrow}</span>
          <span>{Math.abs(change)}%</span>
          <span className="text-zinc-500 dark:text-zinc-400">vs last period</span>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    pending: { color: 'bg-yellow-500', label: 'Pending' },
    paid: { color: 'bg-blue-500', label: 'Paid' },
    processing: { color: 'bg-orange-500', label: 'Processing' },
    shipped: { color: 'bg-purple-500', label: 'Shipped' },
    delivered: { color: 'bg-green-500', label: 'Delivered' },
    cancelled: { color: 'bg-red-500', label: 'Closed' },
    returned: { color: 'bg-zinc-500', label: 'Returned' },
    confirmed: { color: 'bg-green-500', label: 'Resolved' },
    completed: { color: 'bg-blue-500', label: 'Completed' },
    'no-show': { color: 'bg-zinc-500', label: 'No Show' }
  };
  const c = config[status] || config.pending;
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold text-white ${c.color}`}>{c.label}</span>;
};

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [styleSessions, setStyleSessions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_ENV === "development"? import.meta.env.VITE_BACKEND_URL : "/api";

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(`${backendUrl}/order/data`);
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          console.log(res.data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load orders');
      }
    };

    const getSections = async () => {
      try {
        const res = await axios.get(`${backendUrl}/order/c-data`);
        if (res.data.success) {
          setStyleSessions(res.data.consults);
        } else {
          console.log(res.data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load sessions');
      }
    };

    Promise.all([getOrders(), getSections()]).finally(() => setLoading(false));
  }, [backendUrl]);

  // Build customers from orders
  useEffect(() => {
    if (!orders?.length) return;

    const customerMap = orders
    .filter(order => order.status!== 'cancelled' && order.email)
    .reduce((acc, order) => {
        const email = order.email;

        if (!acc[email]) {
          acc[email] = {
            _id: email,
            name: order.customerName,
            email: email,
            orders: 0,
            totalSpent: 0,
            lastOrder: order.createdAt
          };
        }

        acc[email].orders += 1;
        acc[email].totalSpent += order.total || 0;
        // Keep latest order date
        if (new Date(order.createdAt) > new Date(acc[email].lastOrder)) {
          acc[email].lastOrder = order.createdAt;
        }

        return acc;
      }, {});

    setCustomers(Object.values(customerMap));
  }, [orders]);

  // Single loop for all analytics
  const analytics = useMemo(() => {
    if (!orders.length) {
      return {
        totalRevenue: 0,
        totalRevenueChange: 0,
        todayRevenue: 0,
        todayRevenueChange: 0,
        activeOrders: 0,
        totalCustomers: 0,
        totalCustomersChange: 0,
        revenueData: [],
        topCategories: [],
        ordersByStatus: { active: 0, completed: 0, cancelled: 0 }
      };
    }

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
    const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd); yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Init last 7 days for chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return { date: d, day: days[d.getDay()], revenue: 0 };
    });

    let thisWeekRevenue = 0;
    let lastWeekRevenue = 0;
    let todayRevenue = 0;
    let yesterdayRevenue = 0;
    let activeOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    const salesByItem = {};
    const thisWeekCustomerEmails = new Set();
    const lastWeekCustomerEmails = new Set();

    orders.forEach(o => {
      const d = new Date(o.createdAt);
      const isCancelled = o.status === 'cancelled';

      if (isCancelled) cancelledOrders++;

      if (!isCancelled) {
        if (d >= weekAgo) {
          thisWeekRevenue += o.total || 0;
          if (o.email) thisWeekCustomerEmails.add(o.email);
        }
        if (d >= twoWeeksAgo && d < weekAgo) {
          lastWeekRevenue += o.total || 0;
          if (o.email) lastWeekCustomerEmails.add(o.email);
        }
        if (d >= todayStart && d <= todayEnd) todayRevenue += o.total || 0;
        if (d >= yesterdayStart && d <= yesterdayEnd) yesterdayRevenue += o.total || 0;

        // Revenue chart
        const dayIdx = last7Days.findIndex(day => {
          const next = new Date(day.date);
          next.setDate(next.getDate() + 1);
          return d >= day.date && d < next;
        });
        if (dayIdx!== -1) last7Days[dayIdx].revenue += o.total || 0;

        // Top categories
        const items = o.items || [{ itemName: o.itemName, quantity: o.quantity || 1, price: o.total }];
        items.forEach(item => {
          const name = item.itemName || 'Unknown';
          if (!salesByItem[name]) salesByItem[name] = { name, value: 0 };
          salesByItem[name].value += item.quantity || 1;
        });
      }

      if (['paid', 'processing', 'shipped'].includes(o.status)) activeOrders++;
      if (o.status === 'delivered') completedOrders++;
    });

    const getChange = (current, previous) => {
      if (!previous) return current > 0? 100 : 0;
      return +(((current - previous) / previous) * 100).toFixed(1);
    };

    return {
      totalRevenue: Math.round(thisWeekRevenue),
      totalRevenueChange: getChange(thisWeekRevenue, lastWeekRevenue),
      todayRevenue: Math.round(todayRevenue),
      todayRevenueChange: getChange(todayRevenue, yesterdayRevenue),
      activeOrders,
      totalCustomers: customers.length,
      totalCustomersChange: getChange(thisWeekCustomerEmails.size, lastWeekCustomerEmails.size),
      revenueData: last7Days.map(d => ({ day: d.day, revenue: Math.round(d.revenue) })),
      topCategories: Object.values(salesByItem).sort((a, b) => b.value - a.value).slice(0, 4),
      ordersByStatus: { active: activeOrders, completed: completedOrders, cancelled: cancelledOrders }
    };
  }, [orders, customers]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${backendUrl}/order/update-order`, { orderId, status: newStatus });
      if (res.data.success) {
        toast.success('Status updated!');
        setOrders(prev => prev.map(o => o._id === orderId? {...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order');
    }
  };

  const updateEnquiryStatus = async (enquiryId, newStatus) => {
    try {
      const res = await axios.put(`${backendUrl}/order/update-consult`, { 
        consultId: enquiryId, // keep same endpoint if backend didn't change
        status: newStatus 
      });
      if (res.data.success) {
        toast.success('Enquiry updated!');
        setStyleSessions(prev => prev.map(e => e._id === enquiryId? {...e, status: newStatus } : e));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update enquiry');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '🛍' },
    { id: 'sessions', label: 'Enquiries', icon: '✨' },
    { id: 'customers', label: 'Customers', icon: '👥' }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-neutral-950">
        <div className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="mt-5 min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Manage orders, sessions & track performance</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 font-semibold transition ${
                activeTab === tab.id
             ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Revenue"
                value={`₵${analytics.totalRevenue.toLocaleString()}`}
                change={analytics.totalRevenueChange}
                icon="💰"
                color="bg-green-100 dark:bg-green-900/30"
              />
              <StatCard
                title="Today's Revenue"
                value={`₵${analytics.todayRevenue.toLocaleString()}`}
                change={analytics.todayRevenueChange}
                icon="📈"
                color="bg-blue-100 dark:bg-blue-900/30"
              />
              <StatCard
                title="Active Orders"
                value={analytics.activeOrders}
                icon="📦"
                color="bg-rose-100 dark:bg-rose-900/30"
              />
              <StatCard
                title="Total Customers"
                value={analytics.totalCustomers}
                change={analytics.totalCustomersChange}
                icon="👥"
                color="bg-purple-100 dark:bg-purple-900/30"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
                <h3 className="mb-4 text-lg font-bold">Revenue This Week</h3>
                {analytics.revenueData.some(d => d.revenue > 0)? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analytics.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h- items-center justify-center text-zinc-500">No revenue data for the last 7 days</div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
                <h3 className="mb-4 text-lg font-bold">Top Categories</h3>
                {analytics.topCategories.length? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.topCategories}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        tickFormatter={(name) => name.length > 12? `${name.slice(0, 12)}...` : name}
                      />
                      <YAxis stroke="#9ca3af" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        cursor={{ fill: 'rgba(244, 63, 94, 0.1)' }}
                      />
                      <Bar dataKey="value" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h- items-center justify-center text-zinc-500">No sales data yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Orders</h2>
              <div className="flex gap-2">
                <span className="rounded-lg bg-rose-500/20 px-3 py-1 text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {analytics.ordersByStatus.active} Active
                </span>
                <span className="rounded-lg bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-600 dark:text-green-400">
                  {analytics.ordersByStatus.completed} Done
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-zinc-900">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Size/Color</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4 font-mono text-sm">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4 font-semibold">{order.customerName}</td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{order.itemName}</td>
                        <td className="px-6 py-4 text-sm">
                          {order.size} / <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: order.color }}></span>
                        </td>
                        <td className="px-6 py-4 font-bold text-rose-500">₵{order.total}</td>
                        <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="rounded-lg border border-zinc-300 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Style Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Enquiries</h2>
              <span className="rounded-lg bg-zinc-500/20 px-3 py-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {styleSessions.length} Total
              </span>
            </div>
            
            {styleSessions.length? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {styleSessions.map(enquiry => {
                  const created = new Date(enquiry.createdAt);
                  const updated = new Date(enquiry.updatedAt);
                  
                  return (
                    <div key={enquiry._id} className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{enquiry.name}</h3>
                          <p className="text-xs text-zinc-500">{enquiry.orderNumber}</p>
                        </div>
                        <StatusBadge status={enquiry.status} />
                      </div>

                      <div className="mb-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <p className="flex items-center gap-2">
                          <span>📧</span>
                          <a href={`mailto:${enquiry.email}`} className="hover:text-rose-500">
                            {enquiry.email}
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <span>📱</span>
                          <a href={`tel:${enquiry.phone}`} className="hover:text-rose-500">
                            {enquiry.phone}
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <span>🏷️</span>
                          <span className="font-semibold">{enquiry.subject}</span>
                        </p>
                      </div>

                      <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
                          {enquiry.message}
                        </p>
                      </div>

                      <div className="mb-4 space-y-1 text-xs text-zinc-500">
                        <p>📅 Created: {created.toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                        <p>🔄 Updated: {updated.toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateEnquiryStatus(enquiry._id, 'confirmed')}
                          disabled={enquiry.status === 'confirmed'}
                          className="flex-1 rounded-lg bg-green-500 py-2 text-xs font-bold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => updateEnquiryStatus(enquiry._id, 'cancelled')}
                          disabled={enquiry.status === 'cancelled'}
                          className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-12 text-center shadow-lg dark:bg-zinc-900">
                <p className="text-zinc-500">No enquiries yet</p>
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Customers</h2>
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-zinc-900">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Orders</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Total Spent</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-zinc-500">Last Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {customers.map(customer => (
                      <tr key={customer._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4 font-semibold">{customer.name}</td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{customer.email}</td>
                        <td className="px-6 py-4">{customer.orders}</td>
                        <td className="px-6 py-4 font-bold text-rose-500">₵{Math.round(customer.totalSpent)}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          {customer.lastOrder? new Date(customer.lastOrder).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};