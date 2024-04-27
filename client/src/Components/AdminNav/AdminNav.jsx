import './AdminNav.css'
import { useSelector } from 'react-redux'

function AdminNav({title}) {
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data

  return (
    <div className='adminNav'>
        <h2>{title}</h2>

        <div className="profile">
            <img src={user?.profileImg} alt='profile' />
            <p>{user?.penName}</p>
        </div>
    </div>
  )
}

export default AdminNav