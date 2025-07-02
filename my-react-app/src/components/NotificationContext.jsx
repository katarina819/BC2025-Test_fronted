import React, { createContext, useState, useContext, useEffect } from "react";
import { getUserNotifications } from "../services/api";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ userId, children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get notifications when userId changes
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    getUserNotifications(userId)
      .then(data => {
        setNotifications(data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch notifications:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const addNotification = (message) => {
    setNotifications(prev => [
      ...prev,
      { id: Date.now(), message, read: false, time: new Date().toISOString() }
    ]);
  };

  const clearNotifications = () => setNotifications([]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        addNotification,
        clearNotifications,
        markAsRead,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
