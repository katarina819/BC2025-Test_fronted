import { useEffect, useState } from "react";

export default function About() {
  // State variables for animated counters
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);
  const [rating, setRating] = useState(0);

  // useEffect runs once on component mount to start counting animations
  useEffect(() => {
    /**
     * Animates a numeric value from 0 up to the target value.
     * @param {number} target - The number to count up to
     * @param {function} setter - React state setter to update the displayed number
     * @param {number} step - Increment step per interval (default 1)
     * @param {number} delay - Interval delay in milliseconds (default 10)
     */
    const animateCount = (target, setter, step = 1, delay = 10) => {
      let count = 0;
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target; // Clamp to target
          clearInterval(interval); // Stop counting
        }
        setter(Number(count.toFixed(1))); // Update state (with 1 decimal place precision)
      }, delay);
    };

    // Animate each counter with different parameters:
    // Larger steps mean faster counting; rating has smaller step for decimal precision
    animateCount(507, setOrders, 5, 10);
    animateCount(1002, setUsers, 10, 10);
    animateCount(4.8, setRating, 0.1, 50);

  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fff8f0",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        color: "#3a3a3a",
        lineHeight: "1.6",
      }}
    >
      {/* Section title */}
      <h2 style={{ color: "#d84315", marginBottom: "1rem" }}>About Us</h2>

      {/* Description paragraph */}
      <p style={{ fontSize: "1.1rem" }}>
        Pizza & Drinks Box was founded in 1999 with a passion for crafting the best pizzas and refreshing drinks.
        Our mission is to bring delicious food and excellent service right to your doorstep,
        making every meal a memorable experience.
        Thank you for choosing Pizza & Drinks Box — where every bite feels like home!
      </p>

      {/* Container for counters: Orders, Users, Rating */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-around",
          gap: "1rem",
        }}
      >
        {/* Map over stats to render counter boxes */}
        {[{
          label: "Orders",
          value: orders,
          bgColor: "#d84315",
          shadowColor: "rgba(216, 67, 21, 0.3)"
        }, {
          label: "Users",
          value: users,
          bgColor: "#ff7043",
          shadowColor: "rgba(255, 112, 67, 0.3)"
        }, {
          label: "Rating",
          value: rating.toFixed(1),
          bgColor: "#fb8c00",
          shadowColor: "rgba(251, 140, 0, 0.3)"
        }].map(({ label, value, bgColor, shadowColor }) => (
          <div
            key={label}
            style={{
              backgroundColor: bgColor,
              color: "white",
              borderRadius: "8px",
              padding: "1rem 1.5rem",
              minWidth: "120px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: `0 4px 10px ${shadowColor}`,
              fontWeight: "700",
              fontSize: "1.1rem",
              textAlign: "center",
            }}
          >
            {/* Label text (Orders, Users, Rating) */}
            <div>{label}</div>

            {/* Animated numeric value */}
            <div style={{ fontSize: "1.8rem", marginTop: "0.25rem" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
