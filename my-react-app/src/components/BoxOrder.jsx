import React, { useState, useEffect } from "react";
import { getAllPizzas, getAllDrinks } from "../services/api";
import { useCart } from "../CartContext";

export default function BoxOrder() {
  const { addToCart, removeFromCart } = useCart();

  const [pizzaList, setPizzaList] = useState([]);
  const [drinkList, setDrinkList] = useState([]);

  const [selectedPizzaId, setSelectedPizzaId] = useState("");
  const [selectedPizzaSize, setSelectedPizzaSize] = useState("medium");
  const [pizzaQty, setPizzaQty] = useState(1);

  const [selectedDrinkId, setSelectedDrinkId] = useState("");
  const [drinkQty, setDrinkQty] = useState(1);

  const [activeButton, setActiveButton] = useState(null);

  const sizeMap = { Mala: "small", Srednja: "medium", Velika: "large" };

  useEffect(() => {
    getAllPizzas()
      .then(res => setPizzaList(res.data))
      .catch(err => console.error(err));

    getAllDrinks()
      .then(res => setDrinkList(res.data))
      .catch(err => console.error(err));
  }, []);

  const selectedPizza = pizzaList.find(
    (p) => p.pizzaId === selectedPizzaId && sizeMap[p.size] === selectedPizzaSize
  );

  const selectedDrink = drinkList.find(d => d.drinkId === selectedDrinkId);

  const currentPizzaPrice = selectedPizza ? selectedPizza.price * pizzaQty : 0;
  const currentDrinkPrice = selectedDrink ? selectedDrink.price * drinkQty : 0;

  const handleButtonClick = (buttonName, action) => {
    setActiveButton(buttonName);
    action();
    setTimeout(() => setActiveButton(null), 300);
  };

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
    <div className="box-order-wrapper">
      <div className="dual-order-container">

        {/* PIZZA SECTION */}
        <div className="order-section">
          <h2 className="box-order-title">Order Pizzas</h2>
          <div className="pizza-input-row">
            <select
              value={selectedPizzaSize}
              onChange={(e) => setSelectedPizzaSize(e.target.value)}
              aria-label="Select pizza size"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <select
              value={selectedPizzaId}
              onChange={(e) => setSelectedPizzaId(e.target.value)}
              aria-label="Select pizza"
            >
              <option value="">Select Pizza</option>
              {pizzaList
                .filter((p) => sizeMap[p.size] === selectedPizzaSize)
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
              aria-label="Pizza quantity"
            />
          </div>
          <div className="pizza-price-row">
            <p>Price: €{currentPizzaPrice.toFixed(2)}</p>
          </div>
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

        {/* DRINKS SECTION */}
        <div className="order-section">
          <h2 className="box-order-title">Order Drinks</h2>
          <div className="drink-input-row">
            <select
              value={selectedDrinkId}
              onChange={(e) => setSelectedDrinkId(e.target.value)}
              aria-label="Select drink"
            >
              <option value="">Select Drink</option>
              {drinkList.map((d) => (
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
              aria-label="Drink quantity"
            />
          </div>
          <div className="drink-price-row">
            <p>Price: €{currentDrinkPrice.toFixed(2)}</p>
          </div>
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
    </div>
  );
}
