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
import AuthSection from "../components/Sections/AuthSection_ForLogIn"
import SignUpSection from "../components/Sections/AuthSection_ForSignUp"
import SearchBar from "../components/genericComponents/SearchBox"
import SideBarFilterSection from "../components/Sections/SideBarFilterSection"

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
       <AuthSection/> 
       <SignUpSection/>
       <SideBarFilterSection/>
    </>
  )
}

export default App
