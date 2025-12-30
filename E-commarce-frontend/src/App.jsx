import HeroProduct from "../components/Sections/HeroProduct"
import Navbar from "../components/Sections/Navbar"
import TapInfo from "../components/Sections/tap_Info"
import LimitedSale from "../components/Sections/LimitedSale"
import FeaturesSection from "../components/Sections/Features"
import ReviewsSection from "../components/Sections/CustomersReviews"
import Brands from "../components/Sections/Brands"
import Footer from "../components/Sections/footer"
import TitleOfPages from "../components/Sections/TitleOfPages"
import HomeProducts from "../components/Sections/HomeProducts"
import AboutSection from "../components/Sections/AboutSection"
import StoresSection from "../components/Sections/StoreInfoSection"
import QAandContactSection from "../components/Sections/QA&ContactSection"
import CartSection from "../components/Sections/CartSection"
import CartTotalsWithPayment from "../components/Sections/CartwithPaymentSection"
import BillingDetailsSection from "../components/Sections/BillingDetailsSection"

function App() {
  
  return (
    <>
       <TapInfo/>
       <Navbar />
       <TitleOfPages Title="About us"/>
       <AboutSection/>
       <HeroProduct />
       <FeaturesSection />
       <LimitedSale />
       <ReviewsSection /> 
       <Brands/>
       <StoresSection/>
       <QAandContactSection/>
       <CartTotalsWithPayment subtotal={3000} total={3000}/>
       <Footer/>
       <HomeProducts/>
       <CartSection/>
       <BillingDetailsSection/>
    </>
  )
}

export default App
