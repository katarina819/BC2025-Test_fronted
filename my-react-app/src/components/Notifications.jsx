import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { getUserNotifications } from "../services/api";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  if (!user || notifications.length === 0) return null;

  return (
    <div className="notifications">
      <h3>Notifications:</h3>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.notificationId}>
            {/* You can make the link clickable */}
            <a href={notif.link} target="_blank" rel="noopener noreferrer">
              {notif.message}
            </a>
            {/* Optional: show time */}
            <small style={{ display: "block", fontSize: "0.8em", color: "#666" }}>
              {new Date(notif.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
