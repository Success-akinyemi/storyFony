import './NewPassword.css'
import iconImg from '../../assets/icon.png'
import botImg from '../../assets/bot.png'
import f1Img from '../../assets/f1.png'
import f2Img from '../../assets/f2.png'
import f3Img from '../../assets/f3.png'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { newPassword } from '../../helpers/api'

function NewPassword() {
    const navigate = useNavigate();
    const location = useLocation()
    const path = location.pathname.split('/')[2]
    const resetToken = path

    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    
    const [ error, setError ] = useState('')
    const [ passwordError, setPasswordError ] = useState('')
    const [confirmPasswordError, setConfirmPasswordError ] = useState('')
    const [ isLoadingData, setIsLoadingData ] = useState('')

    const handleNewPassword = async (e) => {
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
            return setPasswordError('Password cannot be empty')
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

        try {
            setIsLoadingData(true)
            const res = await newPassword({ resetToken, password })

            if(res.data.success){
                navigate('/login')
            } else if(!res.data.success){
                setError(res.data.data)
                setTimeout(() => {
                  setError('')
                }, 5000)
            }
        } catch (error) {
            console.log('ERROR SETTING USER NEW PASSWORD:', error)
            setTimeout(() => {
              setError('')
            }, 3000)
            return setError('An Error occurred. please try again.')
        } finally {
            setIsLoadingData(false)
        }
    }
    
  return (
    <div className='newPassword'>
        <img src={botImg} alt="ai Bot" className='bot' />
        <img src={f1Img} alt="ai Bot" className='f1' />
        <img src={f2Img} alt="ai Bot" className='f2' />
        <img src={f3Img} alt="ai Bot" className='f3' />


        <span className='header'><img src={iconImg} alt="icon" /> StoryFony</span>


        <form className='newPasswordCard' onSubmit={handleNewPassword}>
            {error && <p className='errorText'>{error}</p>}
            <p>Set new password</p>

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
                <button>Set new password</button>
            </div>

        </form>

    </div>
  )
}

export default NewPassword