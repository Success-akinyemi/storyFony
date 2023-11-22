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

function AuthUserNavbar({ enableScrollEffect, miniNav, onBackClick }) {
    const navigate = useNavigate()
    const [isScroll, setIsScroll] = useState(false)
    const [menuOpen, setMenuOpen ] = useState(false)
    const { apiData } = useFetch()

    useEffect(() => {
        if(enableScrollEffect){
            window.onscroll = () => {
                console.log('Scrolling')
                setIsScroll(window.scrollY === 0 ? false : true)
            }
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        navigate('/')
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
                    <Logo />
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
                    <Link className='link authNavLink'>My story books</Link>
                    <Link className='link authNavLink'>Write new story</Link>
                    <Link className='link authNavLink'>My Subscription</Link>
                    <Link className='link authNavLink guide'>Guide <KeyboardArrowDownIcon className='icon' /> 
                    <div className="guideCard">
                        <Link className='link'>Use case studies</Link>
                        <Link className='link'>Public story shelf</Link>
                        <Link className='link'>Learn centre</Link>
                        <Link className='link'>Support</Link>
                    </div>
                    </Link>
                </div>
            ) : (
                ''
            )
        }

        <div className="creditBal">
            <span className='credit'>{apiData?.totalCreditUsed}/{apiData?.totalCredit}</span> fony ink used
        </div>

        <div className="userProfile">
            <div className="image">
            { apiData?.profileImg ? (<img src={apiData?.profileImg} alt='profile'/>) : (<Avatar className='avatar' />)}
            </div> 
            {apiData?.penName} 
            <KeyboardArrowDownIcon className='icon' />

            <div className="profileCard">
                <Link className='link'>My profile</Link>
                <span onClick={handleLogout} className='link'>Logout</span>
            </div>
        </div>
        </div>

    </div>
  )
}

export default AuthUserNavbar