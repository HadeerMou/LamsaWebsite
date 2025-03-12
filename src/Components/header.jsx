import logo from "../logo.png";
import "./header.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../TranslationContext"; // Import translation hook
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "../CurrencyContext";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";

function Header({
  toggleProductsVisibility,
  toggleCartVisibility,
  totalQuantity,
}) {
  const [cart, setCart] = useState([]); // ✅ Define cart state
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { translations, changeLanguage } = useTranslation(); // Using translation context
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default language is English
  const { selectedCurrency, changeCurrency } = useCurrency(); // Using currency context

  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data); // Update cart state
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage); // Update language in context
  };

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    changeCurrency(newCurrency); // Update Currency in context
  };

  // Simulate login state (replace this with actual login state logic)
  const isLoggedIn = localStorage.getItem("token"); // You can check a token or user data here
  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/profile"); // Navigate to profile if logged in
    } else {
      navigate("/register"); // Navigate to register if not logged in
    }
  };
  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/user-login"); // Redirect to login page
  };
  let [open, setOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="mx-auto flex h-16  items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block text-teal-600" href="#">
          <h2>LAMSA</h2>
        </a>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-800">
              About
            </Link>
            <Link to="/paintings" className="text-gray-600 hover:text-gray-800">
              Paintings
            </Link>
            <Link to="/curtains" className="text-gray-600 hover:text-gray-800">
              Curtains
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-800">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {" "}
              {isLoggedIn ? (
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/user-login"
                    className="bg-red-300 text-white !px-5 !py-2 rounded-md hover:bg-red-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gray-100 text-gray-700 !px-5 !py-2 rounded-md hover:bg-gray-300"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <FaUserCircle
              className="text-3xl text-red-300 cursor-pointer"
              onClick={() => navigate("/profile")}
            />
            <CiShoppingCart
              className="text-3xl text-red-300 cursor-pointer"
              onClick={toggleCartVisibility}
            />
          </div>

          <button
            className="flex md:hidden !p-2 text-gray-600 rounded-sm"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full flex flex-col items-center !py-4 !space-y-4 z-50">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            to="/paintings"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(false)}
          >
            Paintings
          </Link>
          <Link
            to="/curtains"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(false)}
          >
            Curtains
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile Login/Register or Logout */}
          {isLoggedIn ? (
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/user-login"
                className="bg-red-300 text-white !px-4 !py-1 rounded-md hover:bg-red-700"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-100 text-gray-700 !px-4 !py-1 rounded-md hover:bg-gray-300"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
