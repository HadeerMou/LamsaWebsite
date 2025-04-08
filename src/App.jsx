import React, { useState, useEffect } from "react";
import ProductList from "./Components/ProductList";
import Cart from "./Components/cart";
import { TranslationProvider } from "./TranslationContext";
import About from "./Pages/About";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Contact from "./Pages/contact";
import Checkout from "./Pages/checkout";
import ProductView from "./Pages/productView";
import Dshproducts from "./Dashboard/dshproducts";
import DshChat from "./Dashboard/DshChat";
import DshUsers from "./Dashboard/DshUsers";
import DshMessages from "./Dashboard/DshMessages";
import DshOrders from "./Dashboard/DshOrders";
import "./Dashboard/dash.css";
import Dashboard from "./Dashboard/dashboard";
import Profile from "./Pages/profile";
import Signin from "./Pages/signin";
import Signup from "./Pages/signup";
import { CurrencyProvider } from "./CurrencyContext";
import OtpPage from "./Pages/OtpPage";
import EmailInput from "./Pages/emailinput";
import ResetPass from "./Pages/ResetPass";
import Address from "./Pages/address";
import DshCities from "./Dashboard/DshCities";
import DshCountries from "./Dashboard/DshCountries";
import DshCategories from "./Dashboard/DshCategories";
import axios from "axios";
import AdminPage from "./Dashboard/admins";
import ShippingFees from "./Dashboard/ShippingFees";
import ProductDetails from "./Dashboard/ProductDetails";
import CategoryPage from "./Pages/categoryPage";
import OrderSuccess from "./Pages/OrderSuccess";
import UserAddresses from "./Pages/userAddresses";
import Profile2 from "./Pages/profile2";

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  /*   const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); */
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // State for cart items
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const totalQuantity = (cart || []).reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  /* useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches); // Tailwind's `lg` breakpoint
    };

    checkMobile(); // Check on initial load
    window.addEventListener("resize", checkMobile); // Re-check on window resize

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Redirect to Landing page for mobile users
  useEffect(() => {
    if (isMobile && location.pathname === "/") {
      navigate("/landing"); // Redirect to the Landing page
    }
  }, [isMobile, location.pathname, navigate]); */

  // Toggle cart visibility
  const toggleCartVisibility = () => {
    setIsCartVisible((prev) => !prev);
  };

  // Fetch user cart when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      fetchUserCart();
      fetchProducts();
    };

    fetchData();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setIsLoading(false);
    }
  };

  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.cartItems);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to sign in to add items to your cart.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/cart-items`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        fetchUserCart(); // Fetch updated cart from backend
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <CurrencyProvider>
      <TranslationProvider>
        <Routes>
          <Route path="/profile2" element={<Profile2 />} />
          {/*           <Route path="/landing" element={<Landing />} />
           */}{" "}
          <Route
            path="/"
            element={
              <Home
                toggleCartVisibility={toggleCartVisibility}
                cart={cart}
                products={products}
                addToCart={addToCart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/about"
            element={
              <About
                toggleCartVisibility={toggleCartVisibility}
                cart={cart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <Contact
                toggleCartVisibility={toggleCartVisibility}
                cart={cart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/categorypage"
            element={
              <CategoryPage
                products={products}
                cart={cart}
                toggleCartVisibility={toggleCartVisibility}
                addToCart={addToCart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductView
                cart={cart}
                toggleCartVisibility={toggleCartVisibility}
                addToCart={addToCart}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                toggleCartVisibility={toggleCartVisibility}
                cart={cart}
                products={products}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/products" element={<Dshproducts />} />
          <Route path="/dashboard/messages/chat" element={<DshChat />} />
          <Route path="/dashboard/users" element={<DshUsers />} />
          <Route path="/dashboard/messages" element={<DshMessages />} />
          <Route path="/dashboard/orders" element={<DshOrders cart={cart} />} />
          <Route path="/login" element={<Signin userType="USER" />} />
          <Route path="/admin-login" element={<Signin userType="ADMIN" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/email-verification" element={<EmailInput />} />
          <Route path="/forgot-password" element={<EmailInput />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route path="/profile/address" element={<Address />} />
          <Route
            path="/profile/addresses"
            element={
              <UserAddresses
                toggleCartVisibility={toggleCartVisibility}
                cart={cart}
                products={products}
                totalQuantity={totalQuantity}
              />
            }
          />
          <Route path="/dashboard/cities" element={<DshCities />} />
          <Route path="/dashboard/countries" element={<DshCountries />} />
          <Route path="/dashboard/categories" element={<DshCategories />} />
          <Route path="/dashboard/admins" element={<AdminPage />} />
          <Route path="/dashboard/shippingfees" element={<ShippingFees />} />
          <Route
            path="/dashboard/products/productdetails/:productId"
            element={<ProductDetails />}
          />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route
            path="/productlist"
            element={
              <ProductList
                products={products}
                cart={cart}
                addToCart={addToCart}
              />
            }
          />
        </Routes>
        {/* Conditionally render Cart only when products are loaded */}
        {!isLoading && (
          <Cart
            cart={cart}
            toggleCartVisibility={toggleCartVisibility}
            isCartVisible={isCartVisible}
            products={products}
            fetchUserCart={fetchUserCart}
            totalQuantity={totalQuantity}
          />
        )}
      </TranslationProvider>
    </CurrencyProvider>
  );
}
export default App;
