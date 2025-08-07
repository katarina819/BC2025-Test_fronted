import React, { useState } from "react"; 
import "./Menu.css";

const pizzas = [
  { name: "Margherita", ingredients: "Tomato, mozzarella, basil", prices: { Small: 5.4, Medium: 6.5, Large: 7.8 } },
  { name: "Capricciosa", ingredients: "Ham, mushrooms, artichokes, olives", prices: { Small: 7.1, Medium: 8.5, Large: 9.9 } },
  { name: "Pepperoni", ingredients: "Tomato, mozzarella, pepperoni", prices: { Small: 6.5, Medium: 7.8, Large: 9.1 } },
  { name: "Vegetariana", ingredients: "Vegetables, tomato, mozzarella", prices: { Small: 5.9, Medium: 7.1, Large: 8.3 } },
  { name: "Quattro Formaggi", ingredients: "Four cheeses", prices: { Small: 7.6, Medium: 8.8, Large: 9.2 } },
  { name: "Funghi", ingredients: "Mushrooms, tomato, mozzarella", prices: { Small: 5.8, Medium: 7.0, Large: 8.4 } },
  { name: "Hawaiian", ingredients: "Ham, pineapple, cheese", prices: { Small: 7.4, Medium: 8.9, Large: 10.5 } },
  { name: "Diavola", ingredients: "Spicy sausage, peppers, cheese", prices: { Small: 6.9, Medium: 8.2, Large: 9.6 } },
  { name: "BBQ Chicken", ingredients: "Chicken, BBQ sauce, onions", prices: { Small: 7.9, Medium: 9.5, Large: 11.1 } },
  { name: "Tuna", ingredients: "Tuna, capers, red onion", prices: { Small: 6.7, Medium: 8.0, Large: 9.3 } }
];

const drinks = [
  { name: "Coca-Cola", size: "0.5L", price: 2.50 },
  { name: "Fanta", size: "0.5L", price: 2.50 },
  { name: "Jamnica", size: "0.5L", price: 2.00 },
  { name: "Sprite", size: "0.33L", price: 2.20 },
  { name: "Jana voda", size: "0.5L", price: 2.10 },
  { name: "Pepsi Max", size: "0.5L", price: 2.50 },
  { name: "Cedevita Naranča", size: "0.33L", price: 2.30 },
  { name: "Ice Tea Breskva", size: "0.5L", price: 2.40 },
  { name: "Red Bull", size: "0.25L", price: 3.00 },
  { name: "Sensation Limeta-Kiwi", size: "0.5L", price: 2.20 }
];

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPizzas = pizzas.filter(pizza =>
    pizza.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrinks = drinks.filter(drink =>
    drink.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f7f7f7" }}>
      <div style={{ marginBottom: "2rem", textAlign: "left" }}>
        <input
          type="text"
          placeholder="Search pizzas and drinks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            width: "300px",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      <h2 className="menu-title">Pizza Menu</h2>
      <div className="menu-card">
        <table>
          <thead>
            <tr>
              <th>Pizza</th>
              <th>Ingredients</th>
              <th>Small (€)</th>
              <th>Medium (€)</th>
              <th>Large (€)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPizzas.length > 0 ? (
              filteredPizzas.map((pizza, index) => (
                <tr key={index}>
                  <td data-label="Pizza">{pizza.name}</td>
                  <td data-label="Ingredients">{pizza.ingredients}</td>
                  <td data-label="Small (€)">{pizza.prices.Small.toFixed(2)}</td>
                  <td data-label="Medium (€)">{pizza.prices.Medium.toFixed(2)}</td>
                  <td data-label="Large (€)">{pizza.prices.Large.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>No pizzas found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="menu-title" style={{ marginTop: "3rem" }}>Drink Menu</h2>
      <div className="menu-card">
        <table>
          <thead>
            <tr>
              <th>Drink</th>
              <th>Size</th>
              <th>Price (€)</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrinks.length > 0 ? (
              filteredDrinks.map((drink, index) => (
                <tr key={index}>
                  <td data-label="Drink">{drink.name}</td>
                  <td data-label="Size">{drink.size}</td>
                  <td data-label="Price (€)">{drink.price.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" style={{ textAlign: "center" }}>No drinks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
