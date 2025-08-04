import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { useNotification } from "../components/NotificationContext";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const {
    notifications,
    loginTime,
    markAsRead,
    unreadCount,
    clearNotifications,
  } = useNotification();

  if (!user || notifications.length === 0) return null;

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif.notificationId);
    }

    if (notif.link) {
      window.open(notif.link, "_blank");
    }
  };

  return (
    <div className="notifications">
      <h3>Notifikacije ({unreadCount} novih)</h3>
      <button onClick={clearNotifications}>Obriši sve</button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((notif) => {
          const createdAt = new Date(notif.createdAt);
          const isNew = !notif.isRead || createdAt > new Date(loginTime);

          return (
            <li
              key={notif.notificationId}
              onClick={() => handleNotificationClick(notif)}
              style={{
                cursor: "pointer",
                backgroundColor: isNew ? "#d1e7dd" : "#f0f0f0",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "5px",
                borderLeft: isNew ? "5px solid #0f5132" : "5px solid #aaa",
              }}
            >
              <span
                style={{
                  color: isNew ? "#0f5132" : "#555",
                  fontWeight: isNew ? "bold" : "normal",
                }}
              >
                {notif.message}
              </span>

              {isNew && (
                <span
                  style={{
                    marginLeft: "10px",
                    color: "#0f5132",
                    fontSize: "0.8em",
                    fontWeight: "bold",
                  }}
                >
                  New!
                </span>
              )}

              <small
                style={{
                  display: "block",
                  fontSize: "0.8em",
                  color: "#666",
                }}
              >
                {createdAt.toLocaleString()}
              </small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
