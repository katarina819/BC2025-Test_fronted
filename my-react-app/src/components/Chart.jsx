import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import { sendPayment } from "../services/api";
import { useNotification } from "../components/useNotification";


export default function Chart() {
  const { cartItems, clearCart } = useCart();
  const { addNotificationBackend } = useNotification();
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  // Nova stanja za kartično plaćanje
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.profile?.phoneNumber || "",
        address: user.profile?.address || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);

    
    if (e.target.value !== "card") {
      setCardNumber("");
      setCvv("");
      setExpiryDate("");
    }
  };

  const calculateTotal = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  /**
 * Handles form submission for placing an order.
 * 
 * Steps performed:
 * - Prevents default form submission behavior.
 * - Validates card payment details if card payment is selected.
 * - Checks if a user is registered by looking up user ID in localStorage.
 * - Filters cart items into pizzas and drinks.
 * - Validates that the cart contains at least one valid item.
 * - Sends POST request to API to place pizza order if any pizzas exist.
 * - Sends POST request to API to place drinks order if any drinks exist.
 * - Calls sendPayment function to send payment details for each order.
 * - Shows alerts for success or failure.
 * - Clears the cart on successful order.
 * - Manages loading state to disable inputs and buttons during processing.
 */
const handleSubmit = async (e) => {
  e.preventDefault();
   


    // Validation of card data if paymentMethod is "card"
    if (paymentMethod === "card") {
  if (
    !cardNumber.trim() ||
    !cvv.trim() ||
    !expiryMonth.trim() ||
    !expiryYear.trim()
  ) {
    alert("Please enter all card payment details.");
    return;
  }
}


    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;
    if (!userId) {
      alert("User is not registered. Please register first.");
      return;
    }

    const pizzas = cartItems.filter((item) => item.type === "Pizza" && item.quantity > 0);
    const drinks = cartItems.filter((item) => item.type === "Drink" && item.quantity > 0);

    if (pizzas.length === 0 && drinks.length === 0) {
      alert("Your cart is empty or contains invalid items.");
      return;
    }

    setLoading(true);

    try {
      // 1. Send pizza order
if (pizzas.length > 0) {
  const pizzaItems = pizzas.map(p => ({
  PizzaId: p.id,
  Quantity: p.quantity,
  UnitPrice: p.prices[p.size]  
}));


  const pizzaResponseRaw = await fetch(`${import.meta.env.VITE_API_URL}/api/pizzaorders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      UserId: userId,
      Items: pizzaItems,
      PaymentMethod: paymentMethod // "cash" ili "card"
      // NEMA više CardDetails
    })
  });

  if (!pizzaResponseRaw.ok) {
    throw new Error("Failed to place pizza order");
  }

  const pizzaOrderResponse = await pizzaResponseRaw.json();

  if (!pizzaOrderResponse?.orderId) {
    throw new Error("Pizza orderId missing from response");
  }

  // 2. Send payment for pizza order
  await sendPayment({
    orderId: pizzaOrderResponse.orderId,
    paymentMethodId: paymentMethod === "cash" ? 2 : 1,
    amount: calculateTotal(pizzas),
    paymentDate: new Date().toISOString(),
    orderType: "pizza"
  });

  // 3. Optional feedback
  if (paymentMethod === "card" && pizzaOrderResponse.cardPaymentTransactionId) {
    alert(`Pizza card payment transaction ID: ${pizzaOrderResponse.cardPaymentTransactionId}`);
  }
}

      // 2. Send drinks order
      if (drinks.length > 0) {
        const drinkItems = drinks.map((d) => ({
  DrinkId: d.id,
  Quantity: d.quantity
}));

const drinksResponseRaw = await fetch(`${import.meta.env.VITE_API_URL}/api/drinksorder`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    UserId: userId,
    Items: drinkItems,
    PaymentMethod: paymentMethod,
    CardDetails: paymentMethod === "card"
      ? { CardNumber: cardNumber, CVV: cvv, ExpiryDate: expiryDate }
      : null
  })
});


        if (!drinksResponseRaw.ok) {
          throw new Error("Failed to place drinks order");
        }

        const drinksOrderResponse = await drinksResponseRaw.json();

        if (!drinksOrderResponse?.orderId) {
          throw new Error("Drinks orderId missing from response");
        }

        // Send payment for drinks order
        await sendPayment({
          orderId: drinksOrderResponse.orderId,
          paymentMethodId: paymentMethod === "cash" ? 2 : 1,
          amount: calculateTotal(drinks),
          paymentDate: new Date().toISOString(),
          orderType: "drink"
        });

        if (paymentMethod === "card" && drinksOrderResponse.cardPaymentTransactionId) {
          alert(`Drinks card payment transaction ID: ${drinksOrderResponse.cardPaymentTransactionId}`);
        }
      }

      alert(`Order placed! Payment method: ${paymentMethod === "cash" ? "Cash" : "Card"}`);
try {
   addNotificationBackend("Your order has been received and is being processed.", "/orders");

} catch (e) {
  console.error("Failed to add notification:", e);
}
clearCart();

    } catch (err) {
      console.error("Order failed:", err);
      alert(err.message || "Error while placing order.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "0.5rem",
    margin: "0.5rem 0",
    width: "200px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  };


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.type === "Pizza"
                  ? `${item.name} (${item.size}) x${item.quantity}`
                  : `${item.name} x${item.quantity}`}
              </li>
            ))}
          </ul>

          <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "1rem" }}>
    Total price: {calculateTotal(cartItems).toFixed(2)} €
  </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
          
            <h3>Delivery Info:</h3>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              style={inputStyle}
            />
            <br />
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              style={inputStyle}
            />
            <br />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
              style={inputStyle}
            />
            <br />
            <input
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              style={inputStyle}
            />
            <br />

            <h3>Select Payment Method:</h3>
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={handlePaymentChange}
                disabled={loading}
              />
              Cash
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={handlePaymentChange}
                disabled={loading}
              />
              Card
            </label>
            <br />


            
            {paymentMethod === "card" && (
              <>
                <h4>Card Payment Details</h4>
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  disabled={loading}
                  style={inputStyle}
                />
                <br />
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  disabled={loading}
                  style={inputStyle}
                />
                <br />
                {/* months in English */}
<select
  value={expiryMonth}
  onChange={(e) => setExpiryMonth(e.target.value)}
  disabled={loading}
  style={inputStyle}
>
  <option value="">Month</option>
  <option value="01">January</option>
  <option value="02">February</option>
  <option value="03">March</option>
  <option value="04">April</option>
  <option value="05">May</option>
  <option value="06">June</option>
  <option value="07">July</option>
  <option value="08">August</option>
  <option value="09">September</option>
  <option value="10">October</option>
  <option value="11">November</option>
  <option value="12">December</option>
</select>

{/* Years */}
<select
  value={expiryYear}
  onChange={(e) => setExpiryYear(e.target.value)}
  disabled={loading}
  style={inputStyle}
>
  <option value="">Year</option>
  {Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return <option key={year} value={year}>{year}</option>;
  })}
</select>

                <br />
              </>
            )}

            <button
              type="submit"
              disabled={cartItems.length === 0 || loading}
              style={{
                marginTop: "1rem",
                backgroundColor: loading ? "gray" : "green",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Processing..." : "Submit Order"}
            </button>
          </form>

          <button
            onClick={clearCart}
            disabled={loading}
            style={{
              marginTop: "1rem",
              backgroundColor: "red",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            Clear Cart
          </button>

          {loading && <p style={{ marginTop: "1rem" }}>Processing your order, please wait...</p>}
        </>
      )}
    </div>
  );
}
