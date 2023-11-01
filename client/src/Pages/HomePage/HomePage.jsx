import Banner from '../../Components/Banner/Banner'
import Footer from '../../Components/Footer/Footer'
import Hero from '../../Components/Hero/Hero'
import Navbar from '../../Components/Navbar/Navbar'
import Reviews from '../../Components/Reviews/Reviews'
import Stories from '../../Components/Stories/Stories'
import VideoFrame from '../../Components/VideoFrame/VideoFrame'
import CallToAction from '../../Components/callToAction/callToAction'
import './HomePage.css'

function HomePage() {
  return (
    <div className='homePage'>
        <Navbar enableScrollEffect={true} />
        <div className="area-1">
            <div className="layer-1">
                <VideoFrame />
            </div>
            <Hero />
            <Reviews />
        </div>
        <Banner />
        <Stories />
        <CallToAction />
        <Footer />
    </div>
  )
}

export default HomePage