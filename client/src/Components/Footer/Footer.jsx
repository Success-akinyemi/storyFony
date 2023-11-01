import Logo from '../Logo/Logo'
import './Footer.css'
import FbBgImg from '../../assets/fbBg.png'
import Igimg from '../../assets/Ig.png'
import TwImg from '../../assets/tw.png'
import FbImg from '../../assets/fb.png'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='footer'>
        <div className="top">
            <div className="card">
                <div className="left">
                    <div className="head">
                        <h1 className="title">
                        The future of story book creation is here – and it’s yours.
                        </h1>
                        <p className="text">
                        Start a free trial now to access the book studio
                        </p>
                    </div>

                    <div className="body">
                        <div className="start">
                            <Logo />

                            <p className="statText">
                            #! best story writing AI.
                            </p>

                            <div className="startBody">
                                <div className="startIcons">
                                    <a href="" className="link startIcon"><img src={Igimg} alt='instagram'/></a>
                                    <a href="" className="link startIcon"><img src={TwImg} alt='twiter'/></a>
                                    <a href="" className="link startIcon"><img src={FbImg} alt='facebook'/></a>
                                </div>

                                <a className="startConnect">
                                    <a href="" className='link startConnectLink'>
                                        <img src={FbBgImg} alt='facebook' className='startConnectIcon'/>
                                        Join our Facebook community
                                    </a>
                                </a>
                            </div>
                        </div>

                        <div className="middle">
                            <p className="head">Use cases</p>

                            <div className="body">
                                <Link className="link bodyItem">Ai short story generator</Link>
                                <Link className="link bodyItem">Ai adventure story generator</Link>
                                <Link className="link bodyItem">Ai erotic story generator</Link>
                                <Link className="link bodyItem">Ai horror story generator</Link>
                                <Link className="link bodyItem">Ai fantasy story generator</Link>
                                <Link className="link bodyItem">Ai bedtime story generator</Link>
                                <Link className="link bodyItem">View more use case</Link>
                            </div>
                        </div>

                        <div className="end">
                            <p className="title">Our Company</p>

                            <div className="body">
                                <Link className="link bodyItem">Public Libary</Link>
                                <Link className="link bodyItem">Facebook community</Link>
                                <Link className="link bodyItem">Learn centre</Link>
                                <Link className="link bodyItem">Support</Link>
                                <Link className="link bodyItem">Term of Service</Link>
                                <Link className="link bodyItem">Privacy policy</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right">
                    <div className="cards">
                        <div className="card">
                            <div className="card-1"></div>
                            <div className="card-2"></div>
                        </div>
                        <div className="card-3"></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bottom"></div>
    </div>
  )
}

export default Footer