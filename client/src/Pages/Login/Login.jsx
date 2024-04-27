import './Login.css'
import iconImg from '../../assets/icon.png'
import botImg from '../../assets/bot.png'
import f1Img from '../../assets/f1.png'
import f2Img from '../../assets/f2.png'
import f3Img from '../../assets/f3.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../../helpers/api'
import Spinner from '../../Components/Helpers/Spinner/Spinner'
import { signInFailure, signInStart, signInSuccess } from '../../redux/user/userslice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../../Components/OAuth/OAuth'

import Cookies from 'universal-cookie';
import { apiUrl } from '../../Utils/api'
import toast from 'react-hot-toast'
const cookies = new Cookies();
function Login() {
    const allCookies = cookies.getAll();

    //console.log('All Cookies:', allCookies);

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.user)
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ emailError, setEmailError ] = useState('')
    const [ passwordError, setPasswordError ] = useState('')
    const [ errorMs, setError ] = useState('')
    const [ isLoadingData, setIsLoadingData ] = useState(false)
    const [ OAuthLoading, setOAuthLoading ] = useState(false)

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
            dispatch(signInStart())
            //const res = await loginUser({ email, password })
            
            const res = await fetch(apiUrl('/api/login'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({email, password})
              });
              const data =  await res?.json()
              console.log('DATA', data)
                //console.log('LOGIN USER VERIFIED', data.data.verified)
              if(data.success === false){
                toast.error(data?.data)
              }
                if(data.data.verified === false){
                navigate('/VerificationEmailSent', { state: {resMsg: data.data}})
            } 
            if(data.success === true && data.data.verified === true) {
                localStorage.setItem('authToken', data.token)
               dispatch(signInSuccess(data))
               navigate('/dashboard')
            } 


        } catch (errorMsg) {
            console.log('ERROR LOGIN IN USER:', errorMsg)
            const errorM = errorMsg.response?.data?.data || 'An error occurred during the request.';
            console.log('ER', errorM)
            dispatch(signInFailure(errorM))
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
            {errorMs && <p className='errorText'>{errorMs}</p>}
            <p>Log into your account</p>

            <div className="oauthGroup">
                <OAuth setOAuthLoading={setOAuthLoading} />
            </div>

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
                <button disabled={isLoadingData || OAuthLoading} className='loginBtn'>{ isLoadingData  || OAuthLoading ? <Spinner /> : 'Login' }</button>
            </div>
        
            <span className="footNote">
                Don't have an account? <Link className='link' to='/signup'>Signup here</Link>
            </span>
        </form>

    </div>
  )
}

export default Login