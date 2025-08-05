
import React, { useState, useEffect } from "react";
import { getAllPizzas, getAllDrinks } from "../services/api";
import { useCart } from "../CartContext";

export default function BoxOrder() {
  // Get cart manipulation functions from context
  const { addToCart, removeFromCart } = useCart();

  // State to hold lists of pizzas and drinks fetched from API
  const [pizzaList, setPizzaList] = useState([]);
  const [drinkList, setDrinkList] = useState([]);

  // Selected pizza details: id, size, and quantity
  const [selectedPizzaId, setSelectedPizzaId] = useState("");
  const [selectedPizzaSize, setSelectedPizzaSize] = useState("medium"); // Default size, but options are "small", "medium", "large"
  const [pizzaQty, setPizzaQty] = useState(1);

  // Selected drink details: id and quantity
  const [selectedDrinkId, setSelectedDrinkId] = useState("");
  const [drinkQty, setDrinkQty] = useState(1);

  // To track which button is temporarily active (for styling feedback)
  const [activeButton, setActiveButton] = useState(null);

  // Fetch pizzas and drinks from backend API when component mounts
  useEffect(() => {
    getAllPizzas()
      .then(res => setPizzaList(res.data))
      .catch(err => console.error("Error fetching pizzas:", err));

    getAllDrinks()
      .then(res => setDrinkList(res.data))
      .catch(err => console.error("Error fetching drinks:", err));
  }, []);

  // Find the selected pizza object matching chosen id and size
  const selectedPizza = pizzaList.find(
    p => p.pizzaId === selectedPizzaId && p.size === selectedPizzaSize
  );

  // Find the selected drink object matching chosen id
  const selectedDrink = drinkList.find(d => d.drinkId === selectedDrinkId);

  // Calculate current pizza and drink total prices based on quantity
  const currentPizzaPrice = selectedPizza ? selectedPizza.price * pizzaQty : 0;
  const currentDrinkPrice = selectedDrink ? selectedDrink.price * drinkQty : 0;

  /**
   * Handles button click feedback by setting active button state,
   * calling the passed action (add/remove), and resetting after 300ms.
   * @param {string} buttonName - Identifier for button (used for active styling)
   * @param {function} action - Function to execute on click (add/remove)
   */
  const handleButtonClick = (buttonName, action) => {
    setActiveButton(buttonName);
    action();
    setTimeout(() => setActiveButton(null), 300);
  };

  // Adds selected pizza to cart with current quantity and size
  const handleAddPizza = () => {
    if (selectedPizza) {
      addToCart({
        type: "Pizza",
        id: selectedPizza.pizzaId,
        name: selectedPizza.name,
        size: selectedPizza.size,
        quantity: pizzaQty,
        price: selectedPizza.price,
      });
    }
  };

  // Removes selected pizza from cart (matching id and size)
  const handleRemovePizza = () => {
    if (selectedPizza) {
      removeFromCart({
        type: "Pizza",
        id: selectedPizza.pizzaId,
        name: selectedPizza.name,
        size: selectedPizza.size,
      });
    }
  };

  // Adds selected drink to cart with current quantity
  const handleAddDrink = () => {
    if (selectedDrink) {
      addToCart({
        type: "Drink",
        id: selectedDrink.drinkId,
        name: selectedDrink.name,
        size: selectedDrink.size,
        quantity: drinkQty,
        price: selectedDrink.price,
      });
    }
  };

  // Removes selected drink from cart (matching id and size)
  const handleRemoveDrink = () => {
    if (selectedDrink) {
      removeFromCart({
        type: "Drink",
        id: selectedDrink.drinkId,
        name: selectedDrink.name,
        size: selectedDrink.size,
      });
    }
  };

  return (
    <div className="dual-order-container">

      {/* --- PIZZA SECTION --- */}
      <div className="order-section">
        <h2 className="box-order-title">Order Pizzas</h2>

        {/* Single row with 3 controls: pizza size select, pizza select, quantity input */}
        <div className="pizza-input-row">
          <select
            value={selectedPizzaSize}
            onChange={(e) => setSelectedPizzaSize(e.target.value)}
          >
            <option value="small">small</option>
            <option value="medium">medium</option>
            <option value="large">large</option>
          </select>

          <select
            value={selectedPizzaId}
            onChange={(e) => setSelectedPizzaId(e.target.value)}
          >
            <option value="">Select Pizza</option>
            {/* Filter pizzas by selected size */}
            {pizzaList
              .filter((p) => p.size === selectedPizzaSize)
              .map((p) => (
                <option key={p.pizzaId} value={p.pizzaId}>
                  {p.name}
                </option>
              ))}
          </select>

          <input
            type="number"
            min="1"
            value={pizzaQty}
            onChange={(e) => setPizzaQty(Number(e.target.value))}
          />
        </div>

        {/* Row to show current pizza price */}
        <div className="pizza-price-row">
          <p>Price: €{currentPizzaPrice.toFixed(2)}</p>
        </div>

        {/* Buttons to add or remove pizza from cart */}
        <div className="pizza-buttons-row">
          <button
            className={activeButton === "addPizza" ? "active-btn" : ""}
            onClick={() => handleButtonClick("addPizza", handleAddPizza)}
          >
            Add Pizza
          </button>
          <button
            className={activeButton === "removePizza" ? "active-btn" : ""}
            onClick={() => handleButtonClick("removePizza", handleRemovePizza)}
          >
            Remove Pizza
          </button>
        </div>
      </div>

      {/* --- DRINKS SECTION --- */}
      <div className="order-section">
        <h2 className="box-order-title">Order Drinks</h2>

        {/* Drink selection row: dropdown and quantity input */}
        <div className="drink-input-row">
          <select
            value={selectedDrinkId}
            onChange={(e) => setSelectedDrinkId(e.target.value)}
          >
            <option value="">Select Drink</option>
            {drinkList.map(d => (
              <option key={d.drinkId} value={d.drinkId}>
                {d.name} ({d.size})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={drinkQty}
            onChange={(e) => setDrinkQty(Number(e.target.value))}
          />
        </div>

        {/* Show current drink price */}
        <div className="drink-price-row">
          <p>Price: €{currentDrinkPrice.toFixed(2)}</p>
        </div>

        {/* Buttons to add or remove drink from cart */}
        <div className="drink-buttons">
          <button
            className={activeButton === "addDrink" ? "active-btn" : ""}
            onClick={() => handleButtonClick("addDrink", handleAddDrink)}
          >
            Add Drink
          </button>
          <button
            className={activeButton === "removeDrink" ? "active-btn" : ""}
            onClick={() => handleButtonClick("removeDrink", handleRemoveDrink)}
          >
            Remove Drink
          </button>
        </div>
      </div>
    </div>
  );
}
