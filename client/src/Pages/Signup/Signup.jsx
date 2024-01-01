import './Signup.css'
import iconImg from '../../assets/icon.png'
import botImg from '../../assets/bot.png'
import f1Img from '../../assets/f1.png'
import f2Img from '../../assets/f2.png'
import f3Img from '../../assets/f3.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { resgisterUser } from '../../helpers/api'
import Spinner from '../../Components/Helpers/Spinner/Spinner'
import OAuth from '../../Components/OAuth/OAuth'


function Signup() {
    const navigate = useNavigate()
    const [ fisrtName, setFirstName ] = useState('') 
    const [ lastName, setLastName ] = useState('') 
    const [ email, setEmail ] = useState('') 
    const [ penName, setPenName ] = useState('') 
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    
    const [ error, setError ] = useState('')
    const [ fisrtNameError, setFirstNameError ] = useState('')
    const [ lastNameError, setLastNameError ] = useState('')
    const [ emailError, setEmailError ] = useState('')
    const [ passwordError, setPasswordError ] = useState('')
    const [confirmPasswordError, setConfirmPasswordError ] = useState('')
    const [ isLoadingData, setIsLoadingData ] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()

        //const specialChars = /[`~!@#$%^&*()-_+{}[\]\\|,.//?;':"]/g
        const specialChars = /[!@#$%^&*()_+{}[\]\\|;:'",.<>?]/
        
        if(password.includes(" ")){
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                setPasswordError('')
            }, 5000)
            return setPasswordError('Invalid Password')
        } else if(!password){
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                setPasswordError('')
            }, 5000)
            return setPasswordError('Invalid Password')
        }
         else if(password.length < 6){
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                setPasswordError('')
            }, 5000)
            return setPasswordError('Password must be 6 characters long')
        } else if(!specialChars.test(password)){
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                setPasswordError('')
            }, 5000)
            return setPasswordError('Password must contain at least on special character')
        }

        if(password !== confirmPassword){
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
              setConfirmPasswordError('')
            }, 5000)
            return setConfirmPasswordError('Passwords do not match')
        }
      
          if(fisrtName.length <= 1){
            setFirstName('')
            setTimeout(() => {
              setFirstNameError('')
            }, 5000)
            return setFirstNameError('Invalid First Name')
          }

          if(lastName.length <= 1){
            setLastName('')
            setTimeout(() => {
              setLastNameError('')
            }, 5000)
            return setLastNameError('Invalid Last Name')
          }

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
                const res = await resgisterUser({ fisrtName, lastName, email, penName ,password })

                if(res.data.success){
                    navigate('/VerificationEmailSent', { state: {resMsg: res?.data?.data}})
                } else if(!res.data.success){
                    setError(res.data.data)
                    setTimeout(() => {
                      setError('')
                    }, 5000)
                }
            } catch (error) {
                console.log('ERROR REGISTEREING USER:', error)
                setTimeout(() => {
                  setError('')
                }, 3000)
                return setError('An Error occurred. please try again.')
            } finally {
                setIsLoadingData(false)
            }

    }
    return (
    <div className='signup'>
        <img src={botImg} alt="ai Bot" className='bot' />
        <img src={f1Img} alt="ai Bot" className='f1' />
        <img src={f2Img} alt="ai Bot" className='f2' />
        <img src={f3Img} alt="ai Bot" className='f3' />


        <span className='header'><img src={iconImg} alt="icon" /> StoryFony</span>

        <p>Your favorite story book writing studio</p>
        <form onSubmit={handleRegister} className='signupCard'>
            {error && <p className='errorText'>{error}</p>}
            <p>Create an account</p>

            <div className="oauthGroup">
                <OAuth />
            </div>

            <div className="inputGroup">
                <div className="inputField">
                    <label htmlFor="">First Name</label>
                    <input type="text" value={fisrtName} onChange={(e) => setFirstName(e.target.value)}  className={fisrtNameError ? 'errorInput' : ''}/>
                    {fisrtNameError && <p className='errorText'>{fisrtNameError}</p>}
                </div>
                <div className="inputField">
                    <label htmlFor="">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={lastNameError ? 'errorInput' : ''} />
                    {lastNameError && <p className='errorText'>{lastNameError}</p>}
                </div>
            </div>

            <div className="inputGroup">
                <div className="inputField">
                    <label htmlFor="">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={emailError ? 'errorInput' : ''} />
                    {emailError && <p className='errorText'>{emailError}</p>}
                </div>
                <div className="inputField">
                    <label htmlFor="">Pen Name</label>
                    <input type="text"  value={penName} onChange={(e) => setPenName(e.target.value)}/>
                </div>
            </div>

            <div className="inputGroup">
                <div className="inputField">
                    <label htmlFor="">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={passwordError ? 'errorInput' : ''} />
                    {passwordError && <p className='errorText'>{passwordError}</p>}
                </div>
                <div className="inputField">
                    <label htmlFor="">Comfirm Pasword</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={confirmPasswordError ? 'errorInput' : ''} />
                    {confirmPasswordError && <p className='errorText'>{confirmPasswordError}</p>}
                </div>
            </div>

            <div className="button">
                <button className='signinBtn' onClick={handleRegister}>{ isLoadingData ? <Spinner /> : 'Create Account' }</button>
            </div>
        
            <span className="footNote">
                Have an account? <Link className='link' to='/login'>Login here</Link>
            </span>
        </form>

    </div>
  )
}

export default Signup