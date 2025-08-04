// NotificationHub.js
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";

const NotificationHub = () => {
  const [connection, setConnection] = useState(null);
  const [notification, setNotification] = useState(null); // postaje objekt

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5227/notificationHub", {
        withCredentials: true,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR");

          connection.on("ReceiveNotification", (message) => {
  try {
    console.log("Notifikacija primljena:", message);

    // Provjerimo je li poruka string ili objekt
    if (typeof message === "string") {
      setNotification({
        message: message,
        createdAt: new Date().toISOString(),  // postavi trenutni datum
        link: null
      });
      alert(message);
    } else if (typeof message === "object" && message !== null) {
      setNotification(message);
      alert(message.message);
    }
  } catch (error) {
    console.error("Greška u ReceiveNotification handleru:", error);
  }
});

        })
        .catch((e) => console.error("SignalR konekcija neuspješna:", e));
    }
  }, [connection]);

  return (
    <>
      {notification && (
        <div
          style={{
            backgroundColor: "lightgreen",
            padding: "10px",
            marginTop: "10px",
            border: "1px solid green",
            borderRadius: "5px",
            maxWidth: "400px",
          }}
        >
          <strong>{notification.message}</strong>
          <br />
          <small>
            {new Date(notification.createdAt).toLocaleString()}
          </small>
          <br />
          {notification.link && (
            <a href={notification.link} target="_blank" rel="noopener noreferrer">
              Otvori poveznicu
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationHub;
