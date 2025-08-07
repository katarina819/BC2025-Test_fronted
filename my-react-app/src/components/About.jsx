import { useEffect, useState } from "react";

export default function About() {
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const animateCount = (target, setter, step = 1, delay = 10) => {
      let count = 0;
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }
        setter(Number(count.toFixed(1)));
      }, delay);
    };

    animateCount(507, setOrders, 5, 10);
    animateCount(1002, setUsers, 10, 10);
    animateCount(4.8, setRating, 0.1, 50);
  }, []);

  return (
    <div className="about-container">
      <h2>About Us</h2>

      <p>
        Pizza & Drinks Box was founded in 1999 with a passion for crafting the best pizzas and refreshing drinks.
        Our mission is to bring delicious food and excellent service right to your doorstep,
        making every meal a memorable experience.
        Thank you for choosing Pizza & Drinks Box — where every bite feels like home!
      </p>

      <div className="stats-container">
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
            className="stat-box"
            style={{
              backgroundColor: bgColor,
              boxShadow: `0 4px 10px ${shadowColor}`
            }}
          >
            <div>{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
