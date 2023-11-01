import { useLocation } from 'react-router-dom';
import Logo from '../../Components/Logo/Logo'
import './ResetEmailSent.css'

function ResetEmailSent() {
    const location = useLocation();
    const msg = location.state ? location.state.resMsg : 'your email address';

  return (
    <div className='resetEmailSent'>
        <Logo />

        <h1>Reset Password sent Successfull</h1>
        <h3>Email sent to: {msg}</h3>

        <p>Reset password link sent to your email use it to reset your password</p>
    </div>
  )
}

export default ResetEmailSent