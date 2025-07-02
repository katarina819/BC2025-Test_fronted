// src/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  

  const removeFromCart = (itemRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.type === itemRemove.type &&
            item.name === itemRemove.name &&
            item.size === itemRemove.size
          )
        )
    );
      
  };

  const clearCart = () => {
    setCartItems([]);

  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, }}>
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}
