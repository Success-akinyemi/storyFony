import './AdminSidebar.css'
import LogoImg from '../../assets/blackLogo.png'
import HomeImg from '../../assets/adminSidebar/home.png'
import UserImg from '../../assets/adminSidebar/user.png'
import FolderImg from '../../assets/adminSidebar/folder.png'
import UsersImg from '../../assets/adminSidebar/users.png'
import BellImg from '../../assets/adminSidebar/bell.png'
import BlogImg from '../../assets/adminSidebar/chart-square-bar.png'
import GConsoleImg from '../../assets/adminSidebar/chart-bar.png'
import ArrowImg from '../../assets/adminSidebar/arrow.png'
import LogoutImg from '../../assets/adminSidebar/logout.png'


import { Link, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../Utils/api'
import { useDispatch } from 'react-redux'
import Cookies from 'universal-cookie';
import { signOut } from '../../redux/user/userslice'

const cookies = new Cookies();


function AdminSidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLogout = async () => {
        try {
            cookies.remove('fonyAccessToken', {path: '/'})
            cookies.remove('adminfonyAccessToken', {path: '/'})
            await fetch(apiUrl('/api/auth/signout'))
            dispatch(signOut())
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='adminSidebar'>
        <div className="content">
            <div className="top">
                <img src={LogoImg} alt='logo' />
                <div className="addUser">
                    Connect New Account
                </div>

                <Link className='link sideLink' to='/admin-dashboard'>
                    <img src={HomeImg} alt="icon" />
                    Overview
                </Link>

                <div className="linkCard">
                    <p>AUDIENCE</p>
                    <div className="links">
                        <Link className='link sideLink' to='/admin-users'>
                            <img src={UserImg} alt="icon" />
                            Users
                        </Link>
                        <Link className='link sideLink'>
                            <img src={FolderImg} alt="icon" />
                            Stories
                        </Link>
                        <Link className='link sideLink' to='/admin-subscriptions'>
                            <img src={UsersImg} alt="icon" />
                            Subscriptions
                        </Link>
                    </div>
                </div>

                <div className="linkCard">
                    <p>SUPPORT</p>
                    <div className="links">
                        <Link className='link sideLink'>
                            <img src={BellImg} alt="icon" />
                            Support
                        </Link>
                        <Link className='link sideLink'>
                            <img src={BlogImg} alt="icon" />
                            Blog
                        </Link>
                    </div>
                </div>

                <div className="linkCard">
                    <p>ANALYTICS</p>
                    <div className="links">
                        <Link className='link sideLink'>
                            <img src={GConsoleImg} alt="icon" />
                            Google Console
                        </Link>
                        <Link className='link sideLink'>
                            <img src={ArrowImg} alt="icon" />
                            Google Analytics
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bottom">
                <Link onClick={handleLogout} className='link sideLink'>
                    <img src={LogoutImg} alt="icon" />
                    Logout
                </Link>
            </div>
        </div>
    </div>
  )
}

export default AdminSidebar