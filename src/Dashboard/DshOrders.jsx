import React, { useEffect, useState } from "react";
import "./dshorders.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";
import { useCurrency } from "../CurrencyContext";

function DshOrders() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { selectedCurrency, convertAmount } = useCurrency();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const { translations } = useTranslation();
  const [showCreateForm, setShowCreateForm] = useState(false); // Toggle form
  const [orders, setOrders] = useState([]); // State to store orders
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState([]);
  const totalOrders = orders; // Total number of orders
  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  );
  const DeliverdOrders = orders.filter((order) => order.status === "DELIVERED");
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const [filterType, setFilterType] = useState("ALL");

  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterType === "ALL") return true;
    return order.status === filterType;
  });

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token if authentication is needed
      const response = await axios.get(`${API_BASE_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in request
      });

      console.log("Orders Data:", response.data); // Check API response

      if (response.data && response.data) {
        setOrders(response.data); // Ensure correct data is set
      } else {
        console.log("No orders found in response");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("Updated Orders State:", orders); // Check if orders update
  }, [orders]);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token if authentication is needed
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User Data:", response.data); // Debugging

      // Convert array into object for quick lookup
      const usersMap = {};
      response.data.data.forEach((user) => {
        usersMap[user.id] = user;
      });

      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token if authentication is needed

      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in request
      });

      console.log("Fetched Products:", response.data); // Debugging
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Fallback to prevent undefined errors
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchProducts();
  }, []);

  const getProductInfo = (productId) => {
    return products.find((product) => product.id === productId) || {};
  };
  const totalPrice = orders.reduce((acc, order) => {
    return (
      acc + calculateTotalPrice(order.orderItems, getProductInfo, convertAmount)
    );
  }, 0);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order updated:", response.data);

      // Update orders state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      console.log("Order confirmed:", response.data);

      // Refresh orders after confirmation
      fetchOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          OpenSidebar={OpenSidebar}
          openSidebarToggle={openSidebarToggle}
        />
        <div className="middle-container">
          <DASHHeader OpenSidebar={OpenSidebar} />
          <main className="orders">
            <div class="top">
              <div class="columns">
                <div class="newOrders" onClick={() => handleFilterClick("ALL")}>
                  <div class="middle">
                    <div class="left">
                      <h3 className="neworders">{translations.neworders}</h3>
                      <h1>{totalOrders.length}</h1>
                    </div>
                    <div class="icon">
                      <i class="fa-solid fa-bag-shopping"></i>
                    </div>
                  </div>
                  <small class="time">{translations.time}</small>
                </div>
                <div
                  class="onProgress"
                  onClick={() => handleFilterClick("PENDING")}
                >
                  <div class="middle">
                    <div class="left">
                      <h3 className="onprogress">{translations.onprogress}</h3>
                      <h1>{pendingOrders.length}</h1>
                    </div>
                    <div class="icon">
                      <i class="fa-solid fa-spinner"></i>
                    </div>
                  </div>
                  <small class="time">{translations.time}</small>
                </div>
                <div
                  class="readyOrders"
                  onClick={() => handleFilterClick("DELIVERED")}
                >
                  <div class="middle">
                    <div class="left">
                      <h3 className="deliveredorders">
                        {translations.deliveredorders}
                      </h3>
                      <h1>{DeliverdOrders.length}</h1>
                    </div>
                    <div class="icon">
                      <i class="fa-solid fa-clipboard-list"></i>
                    </div>
                  </div>
                  <small class="time">{translations.time}</small>
                </div>
                <div
                  class="cancelledOrders"
                  onClick={() => handleFilterClick("CANCELLED")}
                >
                  <div class="middle">
                    <div class="left">
                      <h3 className="cancelledorders">
                        {translations.cancelledorders}
                      </h3>
                      <h1>{cancelledOrders.length}</h1>
                    </div>
                    <div class="icon">
                      <i class="fa-solid fa-ban"></i>
                    </div>
                  </div>
                  <small class="time">{translations.time}</small>
                </div>
              </div>
            </div>
            <div class="orders">
              <div className="ordersColumns">
                {filteredOrders?.length > 0 ? (
                  filteredOrders.map((order) => {
                    const user = users[order.userId] || {}; // Fetch user by userId
                    const orderDate = new Date(order.createdAt); // Ensure correct date format

                    const formattedDate = orderDate.toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    );

                    const formattedTime = orderDate.toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Set false for 24-hour format
                      }
                    );
                    return (
                      <div className="orderCard" key={order.id}>
                        <div className="info">
                          <div className="left">
                            <h3>{user.username || "Unknown User"}</h3>
                            <p className="order">Order no #{order.id}</p>
                          </div>
                          <div className="right">
                            <p className="new">
                              {formattedDate} <br /> {formattedTime}
                            </p>
                          </div>
                        </div>
                        {order.orderItems?.map((item, index) => {
                          const product =
                            products.find((p) => p.id === item.productId) || {};
                          let imageUrl =
                            product.productImages?.[0]?.imagePath ||
                            "default-product.png";

                          // Ensure URL starts with "https://"
                          if (
                            !imageUrl.startsWith("https://") &&
                            !imageUrl.startsWith("http://")
                          ) {
                            imageUrl = `https://${imageUrl}`;
                          }

                          return (
                            <div className="details" key={index}>
                              <div className="img">
                                <img
                                  src={imageUrl}
                                  alt={product.name || "Product"}
                                />
                              </div>
                              <div className="left">
                                <h3 className="prodname">
                                  {product.name || "Unknown Product"}
                                </h3>
                                <p className="price">
                                  {product.price
                                    ? `${product.price} EGP`
                                    : "N/A"}
                                </p>
                              </div>
                              <div className="right">
                                <h3>{item.quantity} x</h3>
                              </div>
                            </div>
                          );
                        })}
                        <div className="total">
                          <hr />
                          <h3 className="totalpayment">Total price</h3>
                          <h3>
                            {" "}
                            {selectedCurrency === "egp" ? "£" : "$"}
                            {parseInt(totalPrice)}
                            EGP
                          </h3>
                        </div>
                        <div className="button">
                          <button
                            className="orderdetail"
                            onClick={() =>
                              updateOrderStatus(order.id, "received")
                            }
                          >
                            Update Status
                          </button>
                          <hr />
                          <button
                            className="confirmOrder"
                            onClick={() => confirmOrder(order.id)}
                          >
                            Confirm Order
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            </div>
            <button className="showall" onClick={fetchOrders}>
              Show all
            </button>
          </main>
        </div>
      </div>
    </>
  );
}

export default DshOrders;
