import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./CartContext";
import { NotificationProvider } from "./components/NotificationContext";


const userId = "02705186-7608-4e49-bd0e-450e7253735c";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <NotificationProvider userId={userId}>
    <CartProvider>
      <App />
    </CartProvider>
  </NotificationProvider>
</React.StrictMode>
);

