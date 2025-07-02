import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Menu from "./components/Menu";
import BoxOrder from "./components/BoxOrder";
import Chart from "./components/Chart";
import Contact from "./components/Contact";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/box-order" element={<BoxOrder />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<h2>404 -Page not found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}
