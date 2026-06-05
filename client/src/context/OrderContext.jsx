// src/context/OrderContext.jsx
import axios from 'axios';
import React from 'react'
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orderIds, setOrderIds] = useState(() => {
    const saved = localStorage.getItem('emmastudio-orderIds');
    return saved? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);
  const isInitialLoad = useRef(true);

  const backendUrl = import.meta.env.VITE_ENV === "development"? import.meta.env.VITE_BACKEND_URL : "/api";

  // Load orders on mount only
  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!orderIds.length) {
          isInitialLoad.current = false;
          return;
        }

        const promises = orderIds.map(async (orderId) => {
          try {
            const res = await axios.get(`${backendUrl}/order/i-data?orderId=${orderId}`);
            return res.data.success? res.data.data : null;
          } catch (error) {
            console.error(`Failed to fetch order ${orderId}:`, error);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const fetchedOrders = results.filter(Boolean);

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('[ORDERS] Failed to load orders:', error);
      } finally {
        isInitialLoad.current = false;
      }
    };

    loadOrders();
  }, []); // Only on mount - remove orderIds dependency

  // Save orderIds when they change
  useEffect(() => {
    if (isInitialLoad.current) return;
    localStorage.setItem('emmastudio-orderIds', JSON.stringify(orderIds));
  }, [orderIds]);

  const addOrder = (orderId) => {
    // Prevent duplicates
    setOrderIds(prev => {
      if (prev.includes(orderId)) return prev;
      return [...prev, orderId];
    });
  };

  // Add full order object directly - use this after successful checkout
  const addOrderData = (orderData) => {
    setOrders(prev => [...prev, orderData]);
    if (orderData._id) {
      addOrder(orderData._id);
    }
  };

  const ordersCount = orders.length;

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o =>
      o._id === orderId? {...o, status: newStatus } : o
    ));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      addOrderData, // Use this for instant UI update
      ordersCount,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrderContext must be used within OrderProvider');
  return context;
};