import { Link } from 'react-router-dom'
import { menu } from '../../data/menu'
import Logo from '../Logo/Logo'
import './Navbar.css'
import { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function Navbar({ enableScrollEffect }) {
    const [isScroll, setIsScroll] = useState(false)
    const [menuOpen, setMenuOpen ] = useState(false)

        useEffect(() => {
            if(enableScrollEffect){
                window.onscroll = () => {
                    console.log('Scrolling')
                    setIsScroll(window.scrollY === 0 ? false : true)
                }
            }
        }, [])

        const toggle = () => {
            setMenuOpen((prev) => !prev)
            console.log(menuOpen)
        }
  return (
    <div className={`navbar ${isScroll ? 'scroll' : 'none'} ${!enableScrollEffect ? 'show' : ''}`}>
        <div className="logo">
            <Logo />
        </div>

        <div className="menu" onClick={toggle}>
            <MenuIcon className='menuIcon' />
        </div>

        <div className={`menuCard ${menuOpen ? 'show' : 'hide'}`}>
            <div className="closeMenu" onClick={toggle}>
                <CloseIcon className='closeIcon' />
            </div>
            <div className="linkItem">
                {
                    menu.map((item, idx) => (
                        <Link className='link navLink' to={item.path} key={idx} >{item.title}</Link>
                    ))
                }
            </div>

            <div className="cta">
                <Link to='/login' className='link span-1'>Login</Link>

                <span className='span-2'>
                    <Link to='/signup' className='link newAccountLink'>Create account</Link>
                </span>
            </div>

        </div>
    </div>
  )
}

export default Navbar