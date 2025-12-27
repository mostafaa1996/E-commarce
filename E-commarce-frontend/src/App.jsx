import HomeHeader from "../components/Home/Header"
import Navbar from "../components/Top layer/Navbar"
import TapInfo from "../components/Top layer/tap_Info"
import LimitedSale from "../components/Home/LimitedSale"
import FeaturesSection from "../components/Home/Features"
import ReviewsSection from "../components/genericComponents/CustomersReviews"
import Brands from "../components/genericComponents/Brands"

function App() {
  
  return (
    <>
       <TapInfo/>
       <Navbar />
       <HomeHeader />
       <FeaturesSection />
       <LimitedSale />
       <ReviewsSection /> 
       <Brands/>
       
    </>
  )
}

export default App
