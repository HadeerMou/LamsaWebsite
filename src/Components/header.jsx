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
          <nav aria-label="Global" class="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  About{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Paintings{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Curtains{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Contact{" "}
                </a>
              </li>
            </ul>
          </nav>

          <div className="login flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <a
                className="block rounded-md bg-red-300 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                href="#"
              >
                Login
              </a>

              <a
                className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:bg-gray-300/75 text-white sm:block"
                href="#"
              >
                Register
              </a>
            </div>
            <div className="sm:flex sm:gap-3 text-3xl text-red-300 icons">
              <FaUserCircle
                className="cursor-pointer"
                onClick={() => navigate("/profile")}
              />
              <CiShoppingCart
                className="cursor-pointer"
                onClick={toggleCartVisibility}
              />
            </div>

            <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
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
      </div>
    </header>
  );
}

export default Header;
