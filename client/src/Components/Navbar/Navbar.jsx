import { Link } from 'react-router-dom'
import { menu } from '../../data/menu'
import Logo from '../Logo/Logo'
import './Navbar.css'
import { useEffect, useState } from 'react'

function Navbar({ enableScrollEffect }) {
    const [isScroll, setIsScroll] = useState(false)

        useEffect(() => {
            if(enableScrollEffect){
                window.onscroll = () => {
                    setIsScroll(window.pageYOffset === 0 ? false : true)
                }
            }
        }, [])
  return (
    <div className={`navbar ${isScroll ? 'scroll' : 'none'} ${!enableScrollEffect ? 'show' : ''}`}>
        <Logo />

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
  )
}

export default Navbar