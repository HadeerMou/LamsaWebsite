import React from "react";
import Header from "../Components/header";
import Footer from "../Components/footer";
import Products from "../Components/products";
import ProductList from "../Components/ProductList";

function CategoryPage({
  toggleCartVisibility,
  cart,
  products,
  addToCart,
  totalQuantity,
}) {
  return (
    <>
      <Header
        toggleCartVisibility={toggleCartVisibility}
        cart={cart}
        totalQuantity={totalQuantity}
      />
      <ProductList addToCart={addToCart} />
      <Footer />
    </>
  );
}

export default CategoryPage;
