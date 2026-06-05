import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useOrderContext } from '../context/OrderContext';

const statusConfig = {
  'pending': {
    label: 'Payment Pending',
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500',
    step: 0,
    icon: '🕐'
  },
  'paid': {
    label: 'Payment Confirmed',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    step: 1,
    icon: '💳'
  },
  'processing': {
    label: 'Processing',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500',
    step: 2,
    icon: '📦'
  },
  'shipped': {
    label: 'Shipped',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-500',
    borderColor: 'border-indigo-500',
    step: 3,
    icon: '🚚'
  },
  'out_for_delivery': {
    label: 'Out for Delivery',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500',
    step: 4,
    icon: '📍'
  },
  'delivered': {
    label: 'Delivered',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
    step: 5,
    icon: '✅'
  },
  'cancelled': {
    label: 'Cancelled',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    borderColor: 'border-red-500',
    step: -1,
    icon: '❌'
  },
  'returned': {
    label: 'Returned',
    color: 'bg-zinc-500',
    textColor: 'text-zinc-500',
    borderColor: 'border-zinc-500',
    step: -1,
    icon: '↩'
  }
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const config = statusConfig[order.status] || statusConfig['pending'];
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const firstItem = order.items?.[0] || order;
  const itemCount = order.items?.length || 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Order</p>
          <p className="font-mono font-bold text-zinc-900 dark:text-white">
            #{order._id?.slice(-8).toUpperCase() || 'LOCAL'}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white ${config.color}`}>
          <span>{config.icon}</span> {config.label}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <img
            src={firstItem.image || 'https://via.placeholder.com/56'}
            alt={firstItem.name || 'Product'}
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-zinc-900 dark:text-white">
              {firstItem.name || 'Order'}{itemCount > 1 && ` +${itemCount - 1} more`}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {orderDate} • {itemCount} item{itemCount!== 1? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Total</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">₵{order.total?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      <div className="bg-zinc-50 p-4 dark:bg-zinc-800/50">
        <button
          onClick={() => navigate(`/order/${order._id || order.id}`)}
          className="w-full rounded-lg bg-zinc-200 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
        >
          View Details & Track
        </button>
      </div>
    </div>
  );
};

export const Orders = () => {
  const navigate = useNavigate();
  const { orders } = useOrderContext();

  const groupedOrders = {
    active: orders.filter(o => ['pending', 'paid', 'processing', 'shipped', 'out_for_delivery'].includes(o.status)),
    completed: orders.filter(o => o.status === 'delivered'),
    cancelled: orders.filter(o => ['cancelled', 'returned'].includes(o.status))
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-white px-4 py-24 text-zinc-900 dark:bg-black dark:text-white">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 text-8xl">🛍</div>
          <h1 className="mb-4 text-4xl font-bold">No Orders Yet</h1>
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
            You haven't placed any orders. Start building your wardrobe!
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="rounded-full bg-black px-8 py-3 font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-24 text-zinc-900 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-5xl font-bold tracking-tight">Your Orders</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Track and manage all your purchases
          </p>
        </div>

        {groupedOrders.active.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <span className="h-3 w-3 animate-pulse rounded-full bg-rose-500"></span>
              Active Orders
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                {groupedOrders.active.length}
              </span>
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {groupedOrders.active.map(order => (
                <OrderCard key={order._id || order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {groupedOrders.completed.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              Delivered
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                {groupedOrders.completed.length}
              </span>
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {groupedOrders.completed.map(order => (
                <OrderCard key={order._id || order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {groupedOrders.cancelled.length > 0 && (
          <section>
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <span className="h-3 w-3 rounded-full bg-zinc-400"></span>
              Cancelled / Returned
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
                {groupedOrders.cancelled.length}
              </span>
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {groupedOrders.cancelled.map(order => (
                <OrderCard key={order._id || order.id} order={order} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};