import React from "react";
import { useNotification } from "../NotificationContext";

export default function NotificationBell() {
  const { notifications, clearNotifications } = useNotification();

  return (
    <div>
      <button onClick={clearNotifications}>Clear notifications</button>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
}
