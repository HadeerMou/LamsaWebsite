import Approach from "../Components/Approach";
import Featured from "../Components/featured";
import Footer from "../Components/footer";
import Header from "../Components/header";
import HomeGrid from "../Components/HomeGrid";

function Home({
  toggleProductsVisibility,
  toggleCartVisibility,
  cart,
  addToCart,
  totalQuantity,
}) {
  console.log("addToCart in Home:", addToCart);

  return (
    <>
      <Header
        toggleProductsVisibility={toggleProductsVisibility}
        toggleCartVisibility={toggleCartVisibility}
        cart={cart}
        totalQuantity={totalQuantity}
      />
      <HomeGrid />
      <Approach />
      <Featured />
      <Footer />
    </>
  );
}

export default Home;
