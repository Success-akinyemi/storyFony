import './OAuth.css'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../../firebase.js'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../../Utils/api.js'
import toast from 'react-hot-toast'
import { signInSuccess } from '../../redux/user/userslice.js'
import GoogleIcon from '../../assets/googleIcon.png'

function OAuth() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

    const handleOAuth = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result =  await signInWithPopup(auth, provider)
            console.log('AUTH', result)

            const res = await fetch(apiUrl('/api/googleAuth'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                name: result?.user.displayName,
                email: result?.user.email,
                photo: result?.user.photoURL
              }),
            });
            const data = await res?.json()
            if(data?.success){
              dispatch(signInSuccess(data))
              navigate('/dashboard')
            }
            
        } catch (error) {
            toast.error('could not login with google')
            console.log('could not login with google', error)
        }
    }
  return (
    <button type='button' onClick={handleOAuth} className='oAuthBtn' style={{display: 'flex', alignItems: 'center ', justifyContent: 'center' }}>
      <div className="authContent">
        <div className="card">
          <img className='auhImg' src={GoogleIcon} alt='google icon' />
          <p className='authText'>Sign up with Google</p>
        </div>

      </div>
    </button>
  )
}

export default OAuth