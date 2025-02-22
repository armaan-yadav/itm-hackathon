import React, { createContext, useContext, useState, useEffect } from "react";
import { orderServices } from "@/services/orderServices";

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [myOrders, setMyOrders] = useState([]);
  const [manageOrders, setManageOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyOrders = async (userId) => {
    setLoading(true);
    try {
      const orders = await orderServices.getOrdersByUser(userId);
      setMyOrders(orders);
    } catch (error) {
      console.error("Error fetching my orders:", error);
    }
    setLoading(false);
  };

  const fetchManageOrders = async (sellerId) => {
    setLoading(true);
    try {
      const orders = await orderServices.getOrdersBySeller(sellerId);
      setManageOrders(orders);
    } catch (error) {
      console.error("Error fetching manage orders:", error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderServices.updateOrderStatus(orderId, newStatus);

      setMyOrders((prev) =>
        prev.map((order) =>
          order.$id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      setManageOrders((prev) =>
        prev.map((order) =>
          order.$id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        myOrders,
        manageOrders,
        loading,
        fetchMyOrders,
        fetchManageOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
