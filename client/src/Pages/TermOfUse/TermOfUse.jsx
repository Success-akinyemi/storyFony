import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
import './TermOfUse.css'

function TermOfUse() {
  return (
    <div className='termOfUse'>
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className="conatiner"></div>
    </div>
  )
}

export default TermOfUse