import React from "react";
import { useNotification } from "../NotificationContext";

function generateOrderNumber() {
  return Math.floor(Math.random() * 100000);
}

export default function OrderForm() {
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ovdje ide logika za slanje narudžbe (fetch, axios...)

    // Nakon uspješnog slanja narudžbe, dodaj notifikaciju:
    addNotification(`Your order #${generateOrderNumber()} is being prepared.`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Ovdje polja forme za narudžbu */}
      <button type="submit">Submit Order</button>
    </form>
  );
}
