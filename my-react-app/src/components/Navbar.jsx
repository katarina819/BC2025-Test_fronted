
import { Link } from "react-router-dom";
import "../App.css";


export default function Navbar( ) {
  return (
    <nav className="navbar">
  <ul className="nav-list">
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
  
