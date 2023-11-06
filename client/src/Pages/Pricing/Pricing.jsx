import FAQ from '../../Components/FAQ/FAQ'
import Footer from '../../Components/Footer/Footer'
import Navbar from '../../Components/Navbar/Navbar'
import PricingBanner from '../../Components/PricingBanner/PricingBanner'
import { faq } from '../../data/faq'
import './Pricing.css'

function Pricing() {
  return (
    <div className='pricing'>
        <Navbar enableScrollEffect={true} />
        <div className="pricingHero">
            <div className="content">
                <h1>Pricing of our special AI ink </h1>
                <p>We take storytelling to the next level with our innovative AI</p>
            </div>
        </div>
        <PricingBanner />
        <FAQ faq={faq} />
        <Footer />
    </div>
  )
}

export default Pricing