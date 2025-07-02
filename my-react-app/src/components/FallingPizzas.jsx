import React, { useEffect, useState } from 'react';

const pizzaImages = ["/pizza.png", "/pizza2.png", "/pizza3.png"];

const FallingPizzas = ({ count = 30 }) => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    const generated = [...Array(count)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 5}s`,
      src: pizzaImages[Math.floor(Math.random() * pizzaImages.length)],
    }));
    setPizzas(generated);
  }, [count]);

  return (
    <>
      {pizzas.map(pizza => (
        <img
          key={pizza.id}
          src={pizza.src}
          className="falling-pizza"
          style={{
            left: pizza.left,
            animationDelay: pizza.delay,
          }}
          alt="Pizza"
        />
      ))}
    </>
  );
};

export default FallingPizzas;
