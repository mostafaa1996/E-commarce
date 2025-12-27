import HomeHeader from "../components/Home/Header"
import Navbar from "../components/Top layer/Navbar"
import TapInfo from "../components/Top layer/tap_Info"
import LimitedSale from "../components/Home/LimitedSale"
import FeaturesSection from "../components/Home/Features"

function App() {
  
  return (
    <>
       <TapInfo/>
       <Navbar />
       <HomeHeader />
       <FeaturesSection />
       <LimitedSale />
       
    </>
  )
}

export default App
