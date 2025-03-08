import React, { useEffect, useState } from "react";
import "./checkout.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardname: "",
    cardnumber: "",
    expmonth: "",
    expyear: "",
    cvv: "",
    sameadr: true,
  });

  const fetchLocationName = async (id, type) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${type}/${id}`);
      if (type === "district") {
        return response.data.districtName;
      }
      return response.data.name; // Assuming API returns { name: "City Name" }
    } catch (error) {
      console.error(`Error fetching ${type} name:`, error);
      return "";
    }
  };

  const fetchDefaultAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("Unauthorized: Please log in again");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/address/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const defaultAddr = response.data.find((address) => address.isDefault);
      console.log("API Response:", response.data);

      if (defaultAddr) {
        setDefaultAddress(defaultAddr);
        setDefaultAddressId(defaultAddr.id);
        console.log("Fetched Default Address:", defaultAddr);

        // Fetch names for city, country, and district
        const country = await fetchLocationName(
          defaultAddr.Addresses.countryId,
          "country"
        );
        const city = await fetchLocationName(
          defaultAddr.Addresses.cityId,
          "cities"
        );
        const district = await fetchLocationName(
          defaultAddr.Addresses.districtId,
          "district"
        );

        setCountryName(country);
        setCityName(city);
        setDistrictName(district);
        console.log("Fetched Names:", { country, city, district });
      } else {
        alert("No default address found. Please set one in your profile.");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error fetching default address:", error);
    }
  };

  useEffect(() => {
    fetchDefaultAddress();
  }, []);

  useEffect(() => {
    if (
      defaultAddress &&
      defaultAddress.Addresses &&
      countryName &&
      cityName &&
      districtName
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        firstname: defaultAddress.fullName || "",
        email: defaultAddress.email || "",
        address:
          `${defaultAddress.Addresses.buildingNumber}, ${defaultAddress.Addresses.streetName}` ||
          "",
        country: countryName,
        city: cityName,
        district: districtName,
        building: defaultAddress.Addresses.buildingNumber || "",
        apartment: defaultAddress.Addresses.apartmentNumber || "",
      }));
    }
    console.log("Updated Default Address:", defaultAddress);
  }, [defaultAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!defaultAddressId) {
      alert(
        "No default address found. Please select an address before proceeding."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const orderData = {
        total: totalPrice,
        addressId: defaultAddressId,
        orderItems: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: parseInt(item.price, 10),
        })),
      };

      console.log("Final Address ID:", defaultAddressId);
      console.log("Order Payload:", JSON.stringify(orderData, null, 2));

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Order placed", response.data);
      alert("Order placed successfully!");
      navigate("/order-success");
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error);
      alert(
        `Failed to place order: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="title">Checkout</h2>
      <div className="checkrow">
        <div className="col-75">
          <div className="checkcontainer">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-50">
                  <h3>Shipping Address</h3>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="John M. Doe"
                    required
                  />
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="542 W. 15th Street"
                    required
                  />
                  <div className="row">
                    <div className="col-50">
                      <label>Country</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="col-50">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                  </div>
                  <label>District</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="NY"
                    required
                  />
                  <div className="row">
                    <div className="col-50">
                      <label>Building no</label>
                      <input
                        type="text"
                        name="bulding"
                        value={formData.building}
                        onChange={handleChange}
                        placeholder="10"
                        required
                      />
                    </div>
                    <div className="col-50">
                      <label>Apartment no</label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        placeholder="6"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <label>
                <input
                  type="checkbox"
                  name="sameadr"
                  checked={formData.sameadr}
                  onChange={handleChange}
                />{" "}
                Shipping address same as billing
              </label>
              <button type="submit" className="btn">
                Continue to checkout
              </button>
            </form>
          </div>
        </div>

        <div className="col-25">
          <div className="ordcontainer">
            <div className="ordertop">
              <h4>Order Summary</h4>
              <h4>
                <span className="">
                  <i className="fa fa-shopping-cart"></i> <b>{cart.length}</b>
                </span>
              </h4>
            </div>

            {cart.map((item) => (
              <p className="prodOrd" key={item.productId}>
                <img src={item.image} alt={item.name} />{" "}
                <span className="price">
                  {item.name} x {item.quantity} - ${item.price * item.quantity}
                </span>
              </p>
            ))}

            <hr className="checkhr" />
            <p>
              Total{" "}
              <span className="price">
                <b>${totalPrice.toFixed(2)}</b>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
