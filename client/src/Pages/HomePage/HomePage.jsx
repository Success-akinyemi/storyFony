import Banner from '../../Components/Banner/Banner'
import Footer from '../../Components/Footer/Footer'
import Hero from '../../Components/Hero/Hero'
import Navbar from '../../Components/Navbar/Navbar'
import Reviews from '../../Components/Reviews/Reviews'
import Stories from '../../Components/Stories/Stories'
import VideoFrame from '../../Components/VideoFrame/VideoFrame'
import CallToAction from '../../Components/CallToAction/CallToAction'
import './HomePage.css'
import { homePageStoriesData } from '../../data/homePageStories'

function HomePage() {
  return (
    <div className='homePage'>
        <Navbar enableScrollEffect={true} />
        <div className="area-1">
            <div className="layer-1">
                <VideoFrame />
            </div>
            <Hero />
            <div className="layer-2">
              <Reviews />
            </div>
        </div>
        <Banner />
        <Stories data={homePageStoriesData} />
        <CallToAction />
        <Footer />
    </div>
  )
}

export default HomePage