import React, { useEffect, useState } from "react";
import "./profile.css";
import Header from "../Components/header";
import Products from "../Components/products";
import Footer from "../Components/footer";
import { useTranslation } from "../TranslationContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useOrders from "../Hooks/useOrders";
import useProducts from "../Hooks/useProducts";
import { useCurrency } from "../CurrencyContext";

function Profile({
  toggleCartVisibility,
  toggleProductsVisibility,
  cart,
  showProducts,
  totalQuantity,
}) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { translations } = useTranslation();
  const [visibleDiv, setVisibleDiv] = useState("first"); // "first" or "second"
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order
  const { products, fetchProductDetails } = useProducts();
  const { orders, fetchOrders } = useOrders();
  const { selectedCurrency, convertAmount } = useCurrency();
  const [locationNames, setLocationNames] = useState({
    city: "",
    district: "",
    country: "",
  });

  useEffect(() => {
    const fetchLocationNames = async () => {
      if (userAddress) {
        try {
          const { cityId, districtId, countryId } = userAddress;

          const requests = [];

          if (cityId) {
            requests.push(
              axios
                .get(`${API_BASE_URL}/cities/${cityId}`)
                .then((res) => ({ city: res.data.name }))
            );
          }
          if (districtId) {
            requests.push(
              axios
                .get(`${API_BASE_URL}/district/${districtId}`)
                .then((res) => ({ district: res.data.districtName }))
            );
          }
          if (countryId) {
            requests.push(
              axios
                .get(`${API_BASE_URL}/country/${countryId}`)
                .then((res) => ({ country: res.data.name }))
            );
          }
          // Wait for all API calls to resolve
          const results = await Promise.all(requests);
          // Merge results into locationNames state
          setLocationNames((prevState) => ({
            ...prevState,
            ...Object.assign({}, ...results),
          }));
        } catch (error) {
          console.error("Error fetching location names:", error);
        }
      }
    };

    fetchLocationNames();
  }, [userAddress]); // Runs when userAddress changes

  // Fetch product details when orders are available
  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      fetchProductDetails(orders);
    }
  }, [orders]); // Runs whenever `orders` change

  // Retrieve address from local storage on component mount
  useEffect(() => {
    const storedAddress = JSON.parse(localStorage.getItem("userAddress"));
    if (storedAddress) {
      setUserAddress(storedAddress);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for authentication
          },
        });
        setUserData(response.data.data);
      } catch (err) {
        setError("Failed to load profile.");
        console.error("Profile Fetch Error:", err);
      }
    };
    fetchProfile();
    fetchOrders(); // Fetch orders when the profile is loaded
    fetchProductDetails();
  }, []);

  return (
    <>
      <Header
        toggleProductsVisibility={toggleProductsVisibility}
        toggleCartVisibility={toggleCartVisibility}
        cart={cart}
        totalQuantity={totalQuantity}
      />
      <Products showProducts={showProducts} />
      <div class="mycontent">
        <h1 className="welcome">{translations.welcome}</h1>
      </div>
      <div className="profile">
        <div class="left">
          <div class="lists">
            <div class="username">
              <h2>{userData?.username}</h2>
              <h3>{userData?.email}</h3>
            </div>
            <div class="options">
              <ul>
                <li
                  onClick={() => setVisibleDiv("first")}
                  className="personalinfo"
                >
                  {translations.personalinfo}
                </li>
                {/* <li className="billing">{translations.billing}</li> */}
                <li
                  onClick={() => setVisibleDiv("second")}
                  className="ordersname"
                >
                  {translations.ordersname}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="persinfo"
          style={{ display: visibleDiv === "first" ? "block" : "none" }}
        >
          <div className="infos">
            <h5 className="username">{translations.username}</h5>
            <p className="profdata">
              {userData?.username}
              <i class="fa-solid fa-pen-to-square"></i>
            </p>
          </div>
          <div className="infos">
            <h5 className="email">{translations.email}</h5>
            <p className="profdata">
              {userData?.email}
              <i class="fa-solid fa-pen-to-square"></i>
            </p>
          </div>
          <div className="infos">
            <h5 className="number">{translations.number}</h5>
            <p className="profdata">
              {userData?.phone}
              <i class="fa-solid fa-pen-to-square"></i>
            </p>
          </div>
          <div className="passinfo">
            <h5 className="password">{translations.password}</h5>
            <button
              className="changpass"
              onClick={() => navigate("/forgot-password")}
            >
              {translations.changpass}
            </button>
          </div>
          <div className="infos">
            <h5 className="address">{translations.address}</h5>
            <p className="addp">
              <i class="fa-solid fa-location-dot"></i>
              {userAddress
                ? `${userAddress.streetName}, ${locationNames.district}, ${locationNames.city}, ${locationNames.country}`
                : "No address found"}
              <i
                class="fa-solid fa-pen-to-square"
                onClick={() => navigate("/profile/address")}
              ></i>
            </p>
            <a className="all" onClick={() => navigate("/profile/addresses")}>
              {translations.alladdresses}
            </a>
          </div>
        </div>
        <div
          className="ordersinfo"
          style={{ display: visibleDiv === "second" ? "block" : "none" }}
        >
          <div className="head">
            <h1 className="ordersname">Your Orders</h1>
          </div>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => {
              const totalOrderPrice = convertAmount(
                order.orderItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )
              );
              return (
                <div
                  key={order.id}
                  className="ordersContainer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="orderno">
                    <h3 className="text-muted">Order #{order.id}</h3>
                  </div>
                  <div className="orderprice">
                    <p className="text-muted">
                      Total: {selectedCurrency === "egp" ? "£" : "$"}{" "}
                      {totalOrderPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="no">
                    <p className="text-muted">
                      Time: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {selectedOrder && (
            <div className="orderDetails">
              <h2>Order #{selectedOrder.id} Details</h2>
              <p>
                <strong>Total Price:</strong>{" "}
                {selectedCurrency === "egp" ? "£" : "$"}
                {convertAmount(
                  selectedOrder?.orderItems?.reduce(
                    (sum, item) =>
                      sum + (item.price || 0) * (item.quantity || 0),
                    0
                  )
                ).toFixed(2)}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              {selectedOrder.orderItems.map((item) => {
                const product = products[item.productId];
                const imageUrl = product?.productImages?.[0]?.imagePath;
                return (
                  <div key={item.id} className="orderItem">
                    {imageUrl ? (
                      <img
                        src={`https://${imageUrl}`}
                        alt={product?.name}
                        className="product-img"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                    <div>
                      <p>
                        <strong>Product:</strong> {product?.name || "Unknown"}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong>{" "}
                        {selectedCurrency === "egp" ? "£" : "$"}{" "}
                        {convertAmount(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => setSelectedOrder(null)}
                className="close-btn"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
