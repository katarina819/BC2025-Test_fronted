import React, { useEffect, useCallback, useReducer, useState } from "react";
import axios from "axios";
import { updateNotificationStatus, postNotification } from "../services/api";
import { NotificationContext } from "./NotificationContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";



const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
  hasNew: false,
};

function notificationReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
        hasNew: false, // <- resetiraj jer su dohvaćene sve aktualne
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
        hasNew: true, // <- postavi da je stigla nova obavijest
      };
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [], unreadCount: 0, hasNew: false };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.notificationId === action.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

      case "RESET_HAS_NEW":
  return {
    ...state,
    hasNew: false,
  };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.notificationId !== action.payload
        ),
      };
    default:
      return state;
  }
}

export const NotificationProvider = ({ userId, children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [connection, setConnection] = useState(null);

  // 1. Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    const currentUserId = userId; // Snapshot

    dispatch({ type: "FETCH_START" });
    try {
      const response = await axios.get(
        `http://localhost:5227/api/notification/users/${userId}/notifications`,
        { withCredentials: true }
      );
       if (userId === currentUserId) {
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error.message || "Failed to fetch notifications",
      });
    }
  }, [userId]);

  // 2. Setup SignalR connection when userId is available
  useEffect(() => {
    if (!userId) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5227/notificationHub", {
        withCredentials: true,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
    newConnection.stop();  
    setConnection(null);   // jasno resetiraj stanje
  };
}, [userId]);

  // 3. Start SignalR connection and subscribe to notifications
  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveNotification", (message) => {
  const notif = typeof message === "string"
    ? {
        notificationId: Date.now().toString(),
        userId,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
    : message;

    if (notif.userId !== userId) return;

  dispatch({ type: "ADD_NOTIFICATION", payload: notif });
});

connection
  .start()
  .then(() => {
    console.log("SignalR connected!");
  })
  .catch((error) => console.error("SignalR connection failed: ", error));

    return () => {
      connection.off("ReceiveNotification");
    };
  }, [connection, userId]);

  // 4. Fetch notifications once on mount and on userId change
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [fetchNotifications, userId]);

  // 5. Add notification to backend
  const addNotificationBackend = async (message, link = "") => {
    if (!userId) return;

    const newNotif = {
      userId,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      link,
    };

    try {
      await postNotification(newNotif);
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to add notification to backend:", error);
    }
  };

  // 6. Add local notification (client-side only)
  const addNotification = (message, link = "") => {
    const newNotif = {
      notificationId: Date.now().toString(),
      userId,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      link,
    };
    dispatch({ type: "ADD_NOTIFICATION", payload: newNotif });
  };

  const clearNotifications = async () => {
  try {
    await axios.put(
      `http://localhost:5227/api/notification/users/${userId}/notifications/clear`,
      {},
      { withCredentials: true }
    );
    dispatch({ type: "CLEAR_NOTIFICATIONS" }); // ažuriraj lokalno stanje nakon potvrde s backenda
  } catch (error) {
    console.error("Failed to clear notifications:", error);
  }
};

async function deleteUserNotifications(userId) {
  if (!userId) return;

  await fetch(`http://localhost:5227/api/notification/user/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

const logout = async () => {
  if (userId) {
    try {
      await deleteUserNotifications(userId);
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  }

  dispatch({ type: "CLEAR_NOTIFICATIONS" }); // lokalno očisti notifikacije
  localStorage.removeItem("user");
};


  const markAsRead = async (id) => {
    dispatch({ type: "MARK_AS_READ", payload: id });

    try {
      await updateNotificationStatus(userId, id, { isRead: true });
    } catch (err) {
      console.error("Failed to update notification status:", err);
    }
  };

  const removeNotification = (id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const resetHasNew = () => {
  dispatch({ type: "RESET_HAS_NEW" });
};


  // Resetiraj notifikacije kad se userId promijeni
useEffect(() => {
  dispatch({ type: "CLEAR_NOTIFICATIONS" });

  if (userId) {
    fetchNotifications();
  }
}, [userId, fetchNotifications]);

useEffect(() => {
  if (!userId) {
    console.log("UserId je null — brišem sve notifikacije iz state-a");
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
    return;
  }

  fetchNotifications();
}, [userId, fetchNotifications]);


/* useEffect(() => {
  if (!userId) return;

  const newConnection = new HubConnectionBuilder()
    .withUrl("http://localhost:5227/notificationHub", {
      withCredentials: true,
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  setConnection(newConnection);

  return () => {
    if (newConnection) {
      newConnection.stop();
    }
    setConnection(null);
  };
}, [userId]); */


  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        loading: state.loading,
        error: state.error,
        unreadCount: state.unreadCount,
        hasNew: state.hasNew,
        addNotification,
        addNotificationBackend,
        clearNotifications,
        markAsRead,
        removeNotification,
        fetchNotifications,
        resetHasNew,
        logout,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
