import "./about.css";
import Cart from "../Components/cart";
import Footer from "../Components/footer";
import Header from "../Components/header";
import Products from "../Components/products";
import { useTranslation } from "../TranslationContext";
import { useEffect, useState } from "react";

export default function About({
  showProducts,
  toggleCartVisibility,
  toggleProductsVisibility,
  cart,
  totalQuantity,
}) {
  const { translations } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Header
        toggleProductsVisibility={toggleProductsVisibility}
        toggleCartVisibility={toggleCartVisibility}
        cart={cart}
        totalQuantity={totalQuantity}
      />
      <section
        className="aboutcontent min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/9008 mockup.jpg')" }}
      >
        <div className="aboutTitle !pt-90 !p-20">
          <h1 className="abtit !text-6xl">{translations.abtit}</h1>
        </div>
      </section>

      <Footer />
    </>
  );
}
