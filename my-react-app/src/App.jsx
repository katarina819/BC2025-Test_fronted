import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Menu from "./components/Menu";
import BoxOrder from "./components/BoxOrder";
import Chart from "./components/Chart";
import Contact from "./components/Contact";
import { NotificationProvider } from "./components/NotificationProvider";
import NotificationHub from "./components/NotificationHub";
import NotificationBell from "./components/NotificationBell";
import React, { useState, useEffect } from "react";



export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // Praćenje promjene usera u localStorage (logout/login u drugom tabu ili unutar app)
  useEffect(() => {
    function handleStorageChange() {
      try {
        setLoggedInUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setLoggedInUser(null);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null); // resetuj stanje ručno
    window.location.reload(); // osiguraj potpuno resetiranje
  };

  const userId = loggedInUser?.id ?? null;

   return (
    <NotificationProvider key={userId} userId={userId}>

      <Router>
        <Navbar onLogout={logout} loggedInUser={loggedInUser} />
        <NotificationHub />
       <div className="notification-wrapper">
        <NotificationBell />
        </div>
   
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/box-order" element={<BoxOrder />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<h2>404 - Page not found</h2>} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}