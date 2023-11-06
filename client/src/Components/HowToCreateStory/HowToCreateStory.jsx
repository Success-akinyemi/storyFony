import './HowToCreateStory.css'
import CreateImg from '../../assets/createStory.png'

function HowToCreateStory() {
  return (
    <div className='howToCreateStory'>
        <div className="header">
            <h2>How to create a bedtime story with StoryFony AI</h2>
            <p>It's now super easy to create story series with StoryFony</p>
        </div>

        <div className="cards">
            <div className="card">
                <div className="top">
                    <h2><span>Step 1: </span>Select story type</h2>
                    <p>All done with StoryFony AI without needing any previous experience as a writer.</p>
                </div>

                <div className="bottom">
                    <img src={CreateImg} alt='create story image' />
                </div>
            </div>

            <div className="card">
                <div className="top">
                    <h2><span>Step 2: </span>Input story details</h2>
                    <p>All done with StoryFony AI without needing any previous experience as a writer.</p>
                </div>

                <div className="bottom">
                    <img src={CreateImg} alt='create story image' />
                </div>
            </div>

            <div className="card">
                <div className="top">
                    <h2><span>Step 3: </span>Generate complete story</h2>
                    <p>All done with StoryFony AI without needing any previous experience as a writer.</p>
                </div>

                <div className="bottom">
                    <img src={CreateImg} alt='create story image' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default HowToCreateStory