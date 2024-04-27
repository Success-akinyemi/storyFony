import { Link, useNavigate } from 'react-router-dom'
import Logo from '../Logo/Logo'
import './AuthUserNavbar.css'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useFetch } from '../../hooks/fetch.hooks';
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconImg from '../../assets/icon.png'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { apiUrl } from '../../Utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userslice';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function AuthUserNavbar({ enableScrollEffect, miniNav, onBackClick }) {
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const navigate = useNavigate()
    const [isScroll, setIsScroll] = useState(false)
    const [menuOpen, setMenuOpen ] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if(enableScrollEffect){
            window.onscroll = () => {
                console.log('Scrolling')
                setIsScroll(window.scrollY === 0 ? false : true)
            }
        }
    }, [])

    const handleLogout = async () => {
        try {
            cookies.remove('fonyAccessToken', {path: '/'})
            navigate('/')
            await fetch(apiUrl('/api/auth/signout'))
            dispatch(signOut())
        } catch (error) {
            console.log(error)
        }
    }

    const toggle = () => {
        setMenuOpen((prev) => !prev)
        console.log(menuOpen)
    }
  return (
    <div className={`authUserNavbar ${isScroll ? 'scroll' : 'none'} ${!enableScrollEffect ? 'show' : ''}`}>
        {
            !miniNav ? (
                <div className="logo">
                    <Link className='link' to='/dashboard'>
                        <Logo />
                    </Link>
                </div>

            ) : (

                <span className='miniLogo'>
                    {
                        onBackClick ? (
                            <span className="backArrow" onClick={onBackClick}>
                                <ArrowBackIcon className='backArrowIcon' />
                            </span>
                        ) : null
                    }
                    <img src={IconImg} alt='logo' />
                </span>
            )
        }

        <div className="menuBtn" onClick={toggle}>
            <MenuIcon className='menuIcon' />
        </div>
        
        <div className={`right ${menuOpen ? 'show' : 'hide'}`}>
            
            <div className="closeBtn" onClick={toggle}>
                <CloseIcon className='closeIcon' />
            </div>
        {!miniNav ? 
            (
                <div className="links">
                    <Link to='/dashboard' className='link authNavLink'>My story books</Link>
                    <Link to='/create-story' className='link authNavLink'>Write new story</Link>
                    <Link to='/mysubscription' className='link authNavLink'>My Subscription</Link>
                    <Link className='link authNavLink guide'>Guide <KeyboardArrowDownIcon className='icon' /> 
                    <div className="guideCard">
                        <Link className='link' to='/use-case'>Use case studies</Link>
                        <Link className='link' to='/public-shelf'>Public story shelf</Link>
                        <Link className='link' to='/term-of-use'>Learn centre</Link>
                        <Link className='link' to='/support'>Support</Link>
                    </div>
                    </Link>
                </div>
            ) : (
                ''
            )
        }

        <div className="creditBal">
            <span className='credit'>{user?.totalCreditUsed}/{user?.totalCredit}</span> fony ink used
        </div>

        <div className="userProfile">
            <div className="image">
            { user?.profileImg ? (<img src={user?.profileImg} alt='profile'/>) : (<Avatar className='avatar' />)}
            </div> 
            {user?.penName} 
            <KeyboardArrowDownIcon className='icon' />

            <div className="profileCard">
                <Link to='/profile-page' className='link'>My profile</Link>
                <span onClick={handleLogout} className='link'>Logout</span>
                {
                    user?.isAdmin && (
                        <Link to='/admin-login' className='link adminLink'>Admin</Link>
                    )
                }
            </div>
        </div>
        </div>

    </div>
  )
}

export default AuthUserNavbar