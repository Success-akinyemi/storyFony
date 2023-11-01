import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <div className='hero'>
        <div className="herocard">
            <h1 className="heroTitle">
            Turn your story idea into a full-blown story book in 2 minutes
            </h1>

            <div className="heroPara">
            All done with StoryFony AI without needing any previous experience as a story writer.
            </div>

            <span className='heroCta'>
                <Link className='link heroCtaLink'>Start Free Trial</Link>
            </span>
        </div>
    </div>
  )
}

export default Hero