import Navbar from "../Sections/Navbar";
import TapInfo from "../Sections/tap_Info";
import TitleOfPages from "../Sections/TitleOfPages";
import CustomersReviews from "../Sections/CustomersReviews";
import Brands from "../Sections/Brands";
import Footer from "../Sections/footer";
import ProductsListSection from "../Sections/ProductsListSection";
export default function ShopPage() {
  return (
    <>
      <TapInfo />
      <Navbar />
      <TitleOfPages Title="About us" />
      <ProductsListSection />
      <CustomersReviews />
      <Brands />
      <Footer />
    </>
  );
}
