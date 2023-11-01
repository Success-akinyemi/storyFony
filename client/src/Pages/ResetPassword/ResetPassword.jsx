import './ResetPassword.css'
import iconImg from '../../assets/icon.png'
import botImg from '../../assets/bot.png'
import f1Img from '../../assets/f1.png'
import f2Img from '../../assets/f2.png'
import f3Img from '../../assets/f3.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { resetPassword } from '../../helpers/api'

function ResetPassword() {
    const navigate = useNavigate();
    const [ email, setEmail ] = useState('')
    const [ emailError, setEmailError ] = useState('')
    const [ error, setError ] = useState('')
    const [ isLoadingData, setIsLoadingData ] = useState(false)
    
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if(!email){
            setEmail('')
            setTimeout(() => {
              setEmailError('')
            }, 5000)
            return setEmailError('Email required')
          } else if(email.includes(" ")){
            setEmail('')
            setTimeout(() => {
              setEmailError('')
            }, 5000)
            return setEmailError('Invalid Email')
          } 

          try {
            setIsLoadingData(true)
            const res = await resetPassword({ email })

            console.log('rES from client', res)
            if(res.data.success){
              navigate('/resetEmailSent', { state: {resMsg: res?.data.data}})
            }
            
          } catch (errorMsg) {
            console.log('ERROR SENDING LINK USER:', errorMsg)
            const errorM = errorMsg.response?.data?.data || 'An error occurred during the request.';
            console.log('ER', errorM)
            setError(errorM)
            setTimeout(() => {
              setError('')
            }, 5000)
        } finally {
            setIsLoadingData(false)
          }
    }
  return (
    <div className='resetPassword'>
        <img src={botImg} alt="ai Bot" className='bot' />
        <img src={f1Img} alt="ai Bot" className='f1' />
        <img src={f2Img} alt="ai Bot" className='f2' />
        <img src={f3Img} alt="ai Bot" className='f3' />


        <span className='header'><img src={iconImg} alt="icon" /> StoryFony</span>

        <p>Your favorite story book writing studio</p>
        <form className='resetPasswordCard' onSubmit={handleResetPassword}>
            {error && <p className='errorText'>{error}</p>}
            <p>Reset password</p>

            <div className="inputGroup">
                <div className="inputField">
                    <label htmlFor="">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={emailError ? 'errorInput' : ''} />
                    {emailError && <p className='errorText'>{emailError}</p>}
                </div>
            </div>


            <div className="button">
                <button>Proceed</button>
            </div>
        
            <span className="footNote">
                Don't have an account? <Link className='link' to='/signup'>Signup here</Link>
            </span>
        </form>

    </div>
  )
}

export default ResetPassword