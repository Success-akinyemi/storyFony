import './Login.css'
import iconImg from '../../assets/icon.png'
import botImg from '../../assets/bot.png'
import f1Img from '../../assets/f1.png'
import f2Img from '../../assets/f2.png'
import f3Img from '../../assets/f3.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../../helpers/api'

function Login() {
    const navigate = useNavigate()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ emailError, setEmailError ] = useState('')
    const [ passwordError, setPasswordError ] = useState('')
    const [ error, setError ] = useState('')
    const [ isLoadingData, setIsLoadingData ] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()

        if(!email){
            setEmail('')
            setTimeout(() => {
                setEmailError('')
            }, 5000)
            return setEmailError('Email Required')
        }

        if(!password){
            setPassword('')
            setTimeout(() => {
                setPasswordError('')
            }, 5000)
            return setPasswordError('Password Required')
        }

        try {
            setIsLoadingData(true)
            const res = await loginUser({ email, password })
            console.log('RES>>',res)
            if( res.data.isVerified && !res?.data.isVerified){
                navigate('/VerificationEmailSent', { state: {resMsg: res?.data.data}})
            } else{
                navigate('/dashboard')
            } 


        } catch (errorMsg) {
            console.log('ERROR REGISTEREING USER:', errorMsg)
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
    <div className='login'>
        <img src={botImg} alt="ai Bot" className='bot' />
        <img src={f1Img} alt="ai Bot" className='f1' />
        <img src={f2Img} alt="ai Bot" className='f2' />
        <img src={f3Img} alt="ai Bot" className='f3' />


        <span className='header'><img src={iconImg} alt="icon" /> StoryFony</span>

        <p>Your favorite story book writing studio</p>
        <form className='loginCard' onSubmit={handleLogin}>
            {error && <p className='errorText'>{error}</p>}
            <p>Log into your account</p>

            <div className="inputGroup">
                <div className="inputField">
                    <label htmlFor="">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={ emailError ? 'errorInput' : ''} />
                    { emailError && <p className='errorText'>{emailError}</p>}
                </div>
                <div className="inputField">
                    <label htmlFor="">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={passwordError ? 'errorInput' : ''} />
                    { passwordError && <p className='errorText'>{passwordError}</p>}
                </div>
            </div>
            <div className="forgotPassword">
                Forgot password? <Link className='link' to='/resetPassword'>Reset here</Link>
            </div>



            <div className="button">
                <button>Login</button>
            </div>
        
            <span className="footNote">
                Don't have an account? <Link className='link' to='/signup'>Signup here</Link>
            </span>
        </form>

    </div>
  )
}

export default Login