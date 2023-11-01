import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Pages/Signup/Signup'
import Login from './Pages/Login/Login'
import ResetPassword from './Pages/ResetPassword/ResetPassword'
import NewPassword from './Pages/NewPassword/NewPassword'
import VerificationEmailSent from './Pages/VerificationEmailSent/VerificationEmailSent'
import { Toaster } from 'react-hot-toast'
import VerifyUser from './Pages/VerifyUser/VerifyUser'
import ResetEmailSent from './Pages/ResetEmailSent/ResetEmailSent'
import HomePage from './Pages/HomePage/HomePage'

function App() {

  return (
    <div className='app'>
      <Toaster position='top-center'></Toaster>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/resetPassword' element={<ResetPassword />} />
          <Route path='/newPassword/:resetToken' element={<NewPassword />} />
          <Route path='/VerificationEmailSent' element={<VerificationEmailSent />} />
          <Route path='/:id/verify/:token' element={<VerifyUser />} />
          <Route path='/resetEmailSent' element={<ResetEmailSent />} />

          <Route path='/' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
