import React, { useState, useEffect } from "react";
import { registerUser, getUserById, loginUser, updateUser, getUserNotifications } from "../services/api";
import "./Home.css";
import FallingPizzas from "../components/FallingPizzas";

export default function Home() {
  const generateOrderNumber = () => Math.floor(1000 + Math.random() * 9000);

  const [notifications, setNotifications] = useState([]);

  const [registeredUser, setRegisteredUser] = useState(null);

  // After the registered user is set up, we retrieve his notifications
  useEffect(() => {
  if (!registeredUser || !registeredUser.id) return;

  getUserNotifications(registeredUser.id)
    .then(res => setNotifications(res.data))
    .catch(err => console.error(err));
}, [registeredUser]);

  // Initial registration data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phoneNumber: "",
    address: ""
  });

  // To edit your profile
  const [editFormData, setEditFormData] = useState(formData);

  // For the login form
  const [loginData, setLoginData] = useState({ name: "", email: "" });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Login error message
  const [loginError, setLoginError] = useState(null);

  // Form loading and display statuses
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isLoggedIn = !!registeredUser;

  // When mounting the component, load the user from localStorage and refresh the data and notifications
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setRegisteredUser(parsed);
      getUserById(parsed.id)
        .then(res => {
          setRegisteredUser(res.data);
          return getUserNotifications(res.data.id);
        })
        .then(n => setNotifications(n.data))
        .catch(err => console.error(err));
    }
  }, []);

  // User login function
  const handleLogin = async e => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await loginUser(loginData);
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      setRegisteredUser(user);
      const notifs = await getUserNotifications(user.id);
      setNotifications(notifs.data);

      setShowLoginForm(false);
      addNotification(`Welcome back, ${user.name}!`);
    } catch (error) {
      setLoginError("Invalid name or email.");
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Add a new notification to the status
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
      time: "Just now",
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Number of unread notifications

  const unreadCount = notifications.filter(n => !n.read).length;
  // Notification display toggle
  const toggleNotifications = () => setShowNotifications(prev => !prev);

  // Mark the notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Validation of the form for registration and editing
  const validate = data => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.email.includes("@")) newErrors.email = "Email is invalid";
    if (data.age && (+data.age <= 0 || isNaN(+data.age)))
      newErrors.age = "Age must be a positive number";
    if (!data.phoneNumber.trim()) newErrors.phoneNumber = "Phone is required";
    if (!data.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for input fields (registration)
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler for submitting the registration form
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate(formData)) return;
    setIsRegistering(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        profile: {
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        },
      });

      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      setRegisteredUser(user);
      setShowRegisterForm(false);
      alert(`Welcome, ${user.name}!`);

      const orderNumber = generateOrderNumber();
      addNotification(`Your order #${orderNumber} is being prepared.`);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Error during registration.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Handler for login input fields
  const handleLoginChange = e => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setRegisteredUser(null);
    setShowLoginForm(false);
    setShowRegisterForm(false);
    setIsEditing(false);
    addNotification("You have logged out.");
  };

  // Start editing profile
  const startEditing = () => {
    if (registeredUser) {
      setEditFormData({
        name: registeredUser.name,
        email: registeredUser.email,
        age: registeredUser.age || "",
        phoneNumber: registeredUser.profile?.phoneNumber || "",
        address: registeredUser.profile?.address || ""
      });
      setIsEditing(true);
      setShowRegisterForm(false);
      setShowLoginForm(false);
    }
  };

  // Handler for changing input in edit form
  const handleEditChange = e => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save profile changes
  const handleUpdate = async e => {
    e.preventDefault();
    if (!validate(editFormData)) return;

    try {
      const response = await updateUser(registeredUser.id, {
        name: editFormData.name,
        email: editFormData.email,
        age: parseInt(editFormData.age),
        phoneNumber: editFormData.phoneNumber,
        address: editFormData.address
      });

      const updated = response.data;
      localStorage.setItem("user", JSON.stringify(updated));
      setRegisteredUser(updated);
      setIsEditing(false);
      alert("Account updated successfully!");
      addNotification("Your account has been updated.");
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Error updating account.");
    }
  };

  // Presentation of the registration form
  const handleShowRegisterForm = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
    setIsEditing(false);
  };

  // Display of the login form
  const handleShowLoginForm = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
    setIsEditing(false);
  };

  // Cancel handler for closing forms
  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      age: "",
      phoneNumber: "",
      address: ""
    });
    setLoginData({ name: "", email: "" });
    setErrors({});
    setShowRegisterForm(false);
    setShowLoginForm(false);
  };

  return (
    <>
      <FallingPizzas count={20} />

      <header className="header">
        <button
          onClick={toggleNotifications}
          className="notification-button"
          aria-label="Toggle notifications"
        >
          <span className="bell-icon" />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
      </header>

      {showNotifications && (
        <div className="notification-popup">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button onClick={() => setShowNotifications(false)} className="close-btn">×</button>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map(({ id, message, read, time }) => (
                <div
                  key={id}
                  onClick={() => markAsRead(id)}
                  className={`notification-item ${read ? "read" : "unread"}`}
                  title={read ? "Read" : "Unread - click to mark as read"}
                >
                  <p className="notification-message">{message}</p>
                  <span className="notification-time">{time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="home-container">
        <h1 className="home-title">Welcome to Pizza & Drinks Box!</h1>

        {!isLoggedIn && (
          <div className="button-group">
            <button onClick={handleShowRegisterForm} className="submit-btn">Register</button>
            <button onClick={handleShowLoginForm} className="submit-btn">Log In</button>
          </div>
        )}

        {isLoggedIn && (
          <>
            <button onClick={startEditing} className="logout-btn">Edit My Account</button>
            <button onClick={handleLogout} className="logout-btn">Log Out</button>
            <div className="user-info-box">
              <strong>You are logged in as:</strong><br />
              Name: {registeredUser.name}<br />
              Email: {registeredUser.email}
            </div>
          </>
        )}

        {showRegisterForm && !isLoggedIn && (
          <>
            <h2 className="form-title">Register</h2>
            {isRegistering ? (
              <div className="spinner" />
            ) : (
              <form onSubmit={handleSubmit} className="form-container">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                {errors.name && <div className="error">{errors.name}</div>}

                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="error">{errors.email}</div>}

                <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} />
                {errors.age && <div className="error">{errors.age}</div>}

                <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}

                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                {errors.address && <div className="error">{errors.address}</div>}

                <div className="button-group">
                  <button type="submit" className="submit-btn">Register</button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            )}
          </>
        )}

        {showLoginForm && !isLoggedIn && (
          <>
            <h2 className="form-title">Log In</h2>
            <form onSubmit={handleLogin} className="form-container">
              <input name="name" placeholder="Name" value={loginData.name} onChange={handleLoginChange} required />
              <input name="email" type="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
              {loginError && <div className="error">{loginError}</div>}
              <button
                disabled={isLoggingIn}
                type="submit"
                className="submit-btn"
              >
                {isLoggingIn ? "Logging In..." : "Log In"}
              </button>
            </form>
          </>
        )}

        {isEditing && (
          <>
            <h2 className="form-title">Edit Account</h2>
            <form onSubmit={handleUpdate} className="form-container">
              <input name="name" placeholder="Name" value={editFormData.name} onChange={handleEditChange} required />
              {errors.name && <div className="error">{errors.name}</div>}

              <input name="email" type="email" placeholder="Email" value={editFormData.email} onChange={handleEditChange} required />
              {errors.email && <div className="error">{errors.email}</div>}

              <input name="age" type="number" placeholder="Age" value={editFormData.age} onChange={handleEditChange} />
              {errors.age && <div className="error">{errors.age}</div>}

              <input name="phoneNumber" placeholder="Phone Number" value={editFormData.phoneNumber} onChange={handleEditChange} required />
              {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}

              <input name="address" placeholder="Address" value={editFormData.address} onChange={handleEditChange} required />
              {errors.address && <div className="error">{errors.address}</div>}

              <div className="button-group">
                <button type="submit" className="submit-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
