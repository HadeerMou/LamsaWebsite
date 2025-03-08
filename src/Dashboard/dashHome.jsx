import React, { useEffect, useState } from "react";
import axios from "axios";

import { useTranslation } from "../TranslationContext";
import { useCurrency } from "../CurrencyContext";
function DashHome() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { translations } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [users, setUsers] = useState({});
  const { selectedCurrency, convertAmount } = useCurrency();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setOrders(response.data);

        // Count order statuses
        const totalOrders = response.data.length;
        const deliveredOrders = response.data.filter(
          (order) => order.status.toLowerCase() === "delivered"
        ).length;
        const cancelledOrders = response.data.filter(
          (order) => order.status.toLowerCase() === "cancelled"
        ).length;
        const pendingOrders = totalOrders - (deliveredOrders + cancelledOrders);

        // Update stats
        setStats({
          total: totalOrders,
          pending: pendingOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersMap = {};
      response.data.data.forEach((user) => {
        usersMap[user.id] = user;
      });

      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchProducts();
  }, []);

  // Get Recent Orders (Sort by Date & Take the Latest 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const calculateTotalPrice = (orderItems, getProductById, convertAmount) => {
    return orderItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      const price = product?.price ? Number(product.price) : 0; // Ensure price is a number
      const quantity = item.quantity || 1;
      return total + convertAmount(price * quantity);
    }, 0);
  };
  const recentUpdates = recentOrders.map((order) => {
    const user = users[order.userId] || { username: "Unknown" };
    let message = "";

    if (order.status.toLowerCase() === "delivered") {
      message = `${user.username} received their order successfully.`;
    } else if (order.status.toLowerCase() === "cancelled") {
      message = `${user.username} cancelled their order.`;
    } else {
      message = `${user.username} has a pending order.`;
    }

    return {
      message,
      time: "Just now", // Replace with actual time logic if needed
    };
  });

  return (
    <>
      <main className="main-container">
        <div className="main">
          <div className="main-title">
            <h3 className="dashtitle">{translations.dashtitle}</h3>
          </div>

          <div className="main-cards">
            <div className="card">
              <div class="sales">
                <i class="fa-solid fa-chart-pie"></i>
                <div class="middle">
                  <div class="left">
                    <h3 className="totalsales">Total Orders</h3>
                    <h5 className="price">{stats.total}</h5>
                  </div>
                  {/* <div class="progress">
                    <svg>
                      <circle cx="38" cy="38" r="36"></circle>
                    </svg>
                    <div class="number">
                      <p>81%</p>
                    </div>
                  </div> */}
                </div>
                <small class="time">{translations.time}</small>
              </div>
            </div>
            <div className="card">
              <div class="expanses">
                <i class="fa-solid fa-chart-column"></i>
                <div class="middle">
                  <div class="left">
                    <h3 className="totalexpanses">Delivered Orders</h3>
                    <h5 className="price">{stats.delivered}</h5>
                  </div>
                  {/* <div class="progress">
                    <svg>
                      <circle cx="38" cy="38" r="36"></circle>
                    </svg>
                    <div class="number">
                      <p>81%</p>
                    </div>
                  </div> */}
                </div>
                <small class="time">{translations.time}</small>
              </div>
            </div>
            <div className="card">
              <div class="income">
                <i class="fa-solid fa-chart-line"></i>
                <div class="middle">
                  <div class="left">
                    <h3 className="totalincome">Cancelled Orders</h3>
                    <h5 className="price">{stats.cancelled}</h5>
                  </div>
                  {/* <div class="progress">
                    <svg>
                      <circle cx="38" cy="38" r="36"></circle>
                    </svg>
                    <div class="number">
                      <p>81%</p>
                    </div>
                  </div> */}
                </div>
                <small class="time">{translations.time}</small>
              </div>
            </div>
          </div>
          <div class="recent-orders">
            <h2 className="recentorders">{translations.recentorders}</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const user = users[order.userId] || { username: "Unknown" };
                    const orderDate = new Date(order.createdAt);
                    const formattedDate = orderDate.toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    );
                    const formattedTime = orderDate.toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    );

                    const totalPrice = calculateTotalPrice(
                      order.orderItems,
                      (productId) =>
                        products.find((p) => p.id === productId) || {}, // Use products instead of orders
                      convertAmount
                    );

                    return (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{user.username}</td>
                        <td>
                          {formattedDate} {formattedTime}
                        </td>
                        <td>
                          {selectedCurrency === "egp" ? "£" : "$"}
                          {parseInt(totalPrice)}
                        </td>
                        <td className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <a href="#" className="showall">
              Show All
            </a>
          </div>
        </div>
        <div class="right">
          <div class="recent-updates">
            <h2 className="recentupdates">{translations.recentupdates}</h2>
            <div class="updates">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((update, index) => (
                  <div class="update" key={index}>
                    <div class="profile-photo">
                      <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="message">
                      <p>
                        <b>{update.message}</b>
                      </p>
                      <small>{update.time}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent updates available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default DashHome;
