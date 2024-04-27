import './AdminLogin.css'
import f1Img from '../../assets/f1.png'
import f2Img from '../../assets/f2.png'
import f3Img from '../../assets/f3.png'
import Logo from '../../Components/Logo/Logo'
import { useState } from 'react'
import Spinner from '../../Components/Helpers/Spinner/Spinner'
import toast from 'react-hot-toast'
import { adminLogin } from '../../helpers/api'
import { signInSuccess } from '../../redux/user/userslice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function AdminLogin() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [ formData, setFormData ] = useState({})
    const [ isLoading, setIsLoading ] = useState(false)

    const handelChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleAdminlogin = async (e) => {
        e.preventDefault()
        if(!formData.email){
            toast.error('Enter email')
            return
        }
        if(!formData.password){
            toast.error('Enter Password')
            return
        }
        if(!formData.passcode){
            toast.error('Enter Passcode')
            return
        }
        try {
            setIsLoading(true)
            const res = await adminLogin(formData)
            //console.log('adminlogin',res)
            if(res.success) {
                localStorage.setItem('fonyAdminToken', res.token)
               //dispatch(signInSuccess(data))
               navigate('/admin-dashboard')
            } 
        } catch (error) {
            console.log('Unable to Login', error)
        } finally {
            setIsLoading(false)
        }
    }
   return (
    <div className='adminLogin'>
        <div className="nav">
            <div className="logoCard">
                <Logo />
            </div>
        </div>

        <form onSubmit={handleAdminlogin} className="card">
            <div className='top'>
                <p>Super admin login</p>
            </div>

            <div className='inputArea'>
                <div className="inputGroup">
                    <label>
                        Email
                    </label>
                    <input placeholder='Enter Email' id='email' type="email" onChange={handelChange} />
                </div>
                <div className="inputGroup">
                    <label>
                        Passcode
                    </label>
                    <input placeholder='Enter Passcode' id='passcode' type="password" onChange={handelChange} />
                </div>
                <div className="inputGroup">
                    <label>
                        Password
                    </label>
                    <input placeholder='Enter Password' id='password' type="password" onChange={handelChange} />
                </div>
            </div>

            <div className='btn'>
                <button disabled={isLoading} >{ isLoading ? <Spinner /> : 'Login' }</button>
            </div>
        </form>
    </div>
  )
}

export default AdminLogin