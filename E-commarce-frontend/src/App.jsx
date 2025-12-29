import HomeHeader from "../components/Home/Header"
import Navbar from "../components/Sections/Top layer/Navbar"
import TapInfo from "../components/Sections/Top layer/tap_Info"
import LimitedSale from "../components/Home/LimitedSale"
import FeaturesSection from "../components/Home/Features"
import ReviewsSection from "../components/genericComponents/CustomersReviews"
import Brands from "../components/Sections/Brands"
import Footer from "../components/Sections/footer"
import TitleOfPages from "../components/Sections/TitleOfPages"

function App() {
  
  return (
    <>
       <TapInfo/>
       <Navbar />
       <TitleOfPages Title="About us" prevPage="Home" />
       <HomeHeader />
       <FeaturesSection />
       <LimitedSale />
       <ReviewsSection /> 
       <Brands/>
       <Footer/>
       
    </>
  )
}

export default App
