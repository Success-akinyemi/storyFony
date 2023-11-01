import './Logo.css'
import iconImg from '../../assets/icon.png'

function Logo() {
  return (
    <span className='logo'><img src={iconImg} alt="icon" /> StoryFony</span>
  )
}

export default Logo