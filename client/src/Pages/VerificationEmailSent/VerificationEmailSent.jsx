import './VerificationEmailSent.css'
import iconImg from '../../assets/icon.png'
import botImg from '../../assets/bot.png'
import f1Img from '../../assets/f1.png'
import f2Img from '../../assets/f2.png'
import f3Img from '../../assets/f3.png'
import { useLocation } from 'react-router-dom'

function VerificationEmailSent() {
  const location = useLocation();
  const msg = location.state ? location.state.resMsg : 'Please Check your Email to verify Email';

  return (
    <div className='vEmail'>

        <img src={f1Img} alt="ai Bot" className='f1' />
        <img src={f2Img} alt="ai Bot" className='f2' />
        <img src={f3Img} alt="ai Bot" className='f3' />


        <span className='header'><img src={iconImg} alt="icon" /> StoryFony</span>
        <h1>Signup Successfull</h1>
        <h3>Email Verification Required</h3>

        <p>{msg}</p>
    </div>
  )
}

export default VerificationEmailSent