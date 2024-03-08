import { Link } from 'react-router-dom'
import './InsufficientInk.css'
import BeakerImg from '../../../assets/beaker1.png'

function InsufficientInk() {
  return (
    <div className='insufficientInk'>
        <div className="top">
            <div className="head">
                <img className='beaker' src={BeakerImg} alt='beaker' />
                <h3>Oh sorry, you are out of Ink</h3>
            </div>

            <p>You need to get more fony ink to continue writing your story</p>
        </div>

        <span className="btn">
            <Link className='link' to='/pricing'>Get Fony ink</Link>
        </span>
    </div>
  )
}

export default InsufficientInk