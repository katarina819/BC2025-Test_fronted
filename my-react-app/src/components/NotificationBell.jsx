import React, { useState } from "react";
import { useNotification } from "./NotificationContext";



export default function NotificationBell() {
  const { notifications, clearNotifications, unreadCount, markAsRead, fetchNotifications, hasNew, resetHasNew } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);
  

 const toggleDropdown = () => {
  const newState = !showDropdown;
  setShowDropdown(newState);
  
  if (newState) {
    fetchNotifications();
    resetHasNew(); // resetiraj hasNew kada se dropdown otvori
  }
};



  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif.notificationId);
    }
    // Ovdje možeš dodati navigaciju ili nešto drugo po kliku
  };

  return (
    <div className="notification-wrapper">
      <div className="notification-container" style={{ position: "relative" }}>
        <button className="notification-bell" onClick={toggleDropdown}>
          🔔
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          {hasNew && <span className="dot-indicator" />}
        </button>

        {showDropdown && (
          <div className="notification-dropdown">
            <button
              onClick={clearNotifications}
              style={{
                width: "100%",
                padding: "6px",
                border: "none",
                background: "#eee",
                cursor: "pointer",
              }}
            >
              Clear notifications
            </button>
            <ul style={{ margin: 0, padding: 0 }}>
              {notifications.length === 0 ? (
                <li style={{ padding: "10px" }}>No notifications</li>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.notificationId}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: n.isRead ? "white" : "#e0f7fa",
                      padding: "8px",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    {n.message} {!n.isRead && <strong> (New)</strong>}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
