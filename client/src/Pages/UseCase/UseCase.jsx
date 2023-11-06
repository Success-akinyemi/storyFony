import VideoFrame from '../../Components/VideoFrame/VideoFrame'
import './UseCase.css'
import PreviewArrow from '../../assets/game-icons_fast-arrow.png'
import Navbar from '../../Components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import HowToCreateStory from '../../Components/HowToCreateStory/HowToCreateStory'
import Reviews from '../../Components/Reviews/Reviews'
import Stories from '../../Components/Stories/Stories'
import { homePageStoriesData } from '../../data/homePageStories'
import Footer from '../../Components/Footer/Footer'

function UseCase() {
  return (
    <div className='useCase'>
        <Navbar enableScrollEffect={true} />
        <div className="useCaseHero">
            <div className="content">
                <h1>StoryFony AI - The #1 Best AI bedtime story generator in 2023</h1>
                <p>Imagine being able to create bedtime story from your imagination in a minute</p>

                <div className="card">
                    <p>Watch demo video</p>

                    <div className="image">
                        <img src={PreviewArrow} alt='preview arrow' />
                    </div>
                </div>
            </div>

        </div>
            <div className="videoFrame">
                <VideoFrame />
            </div>
        
        <div className="actionCard">
            <h2>Create captivating bedtime story in just 2 minute</h2>
            <p>It's now super easy to create story series with StoryFony AI</p>

            <div className="btn">
                <Link className='link btnLink'>Create your story now</Link>
            </div>
        </div>

        <HowToCreateStory />
        <Reviews name='useCaseReview' />
        <div className="useCaseStoriesCard">
            <Stories data={homePageStoriesData} />
        </div>
        <Footer />
    </div>
  )
}

export default UseCase