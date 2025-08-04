import axios from "axios";

const API_BASE = "http://localhost:5227";

export const markNotificationAsRead = (notificationId) =>
  axios.patch(`${API_BASE}/api/notifications/${notificationId}/read`);


export const registerUser = async (userData) => {
  return await axios.post(`${API_BASE}/api/users`, userData, {
  headers: {
    'Content-Type': 'application/json'
  }
});
};

export async function placePizzaOrder(orderData) {
  return axios.post("http://localhost:5227/api/pizzaorders", orderData);
}

export async function placeDrinksOrder(orderData) {
  return axios.post("http://localhost:5227/api/drinksorder", orderData);
}

export async function getUserById(userId) {
  return axios.get(`${API_BASE}/api/users/${userId}`, {
    withCredentials: true,
  });
};

// Get all the pizzas
export async function getAllPizzas() {
  return axios.get(`${API_BASE}/api/pizza`);
}

// Get pizza by ID
export async function getPizzaById(pizzaId) {
  return axios.get(`${API_BASE}/api/pizza/${pizzaId}`);
}

// Get all the drinks
export async function getAllDrinks() {
  return axios.get(`${API_BASE}/api/drink`);
}

//Get drink by ID
export async function getDrinkById(drinkId) {
  return axios.get(`${API_BASE}/api/drink/${drinkId}`);
}

export async function loginUser(loginData) {
  return axios.post(`${API_BASE}/api/users/login`, loginData, {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true, 
  });
}



export const updateUser = (id, updatedData) => {
  return axios.put(`${API_BASE}/api/users/${id}`, updatedData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};


export async function sendPayment(payment) {
  return fetch('http://localhost:5227/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to send payment');
    return res.json();
  });
}

export const getUserNotifications = (userId) =>
  axios.get(`/api/notifications/user/${userId}`).then(res => res.data);



// Funkcija za update statusa notifikacije
export const updateNotificationStatus = async (userId, id, update) => {
  return axios.patch(
    `${API_BASE}/api/notification/users/${userId}/notifications/${id}`, update, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const postNotification = async (notification) => {
  const response = await axios.post(
    "http://localhost:5227/api/notification",
    notification,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteUserNotifications = (userId) => 
  axios.delete(`${API_BASE}/api/notification/users/${userId}`, { withCredentials: true });













