
import { Link } from "react-router-dom";
import "../App.css";
import { useState } from "react";

export default function Navbar( ) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

  <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/about">About</Link></li>
    <li><Link to="/menu">Menu</Link></li>
    <li><Link to="/box-order">Box Order</Link></li>
    <li><Link to="/chart">Cart</Link></li>
    <li><Link to="/contact">Contact</Link></li>

    
      </ul>
    </nav>
  );
}
  
