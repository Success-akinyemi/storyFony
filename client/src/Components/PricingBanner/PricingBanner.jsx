import './PricingBanner.css'
import Beaker1 from '../../assets/beaker1.png'
import Beaker2 from '../../assets/beaker2.png'
import Beaker3 from '../../assets/beaker3.png'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import BadgeImg from '../../assets/badge.png'
import { fullyFull, halfFull, quaterFull } from '../../data/pricingData';
import { Link } from 'react-router-dom';

function PricingBanner() {
  return (
    <div className='pricingBanner'>
        <div className="container">
            <div className="top">
                <h1>Start free trial for just $1</h1>
                <p>We take storytelling to the next level with our innovative AI. <span>Start Free Trial</span></p>
            </div>

            <div className="bottom">
                <div className="card card-1">
                    <div className="content">
                        <div className="head">
                            <img src={Beaker1} alt='quater ink' />

                            <h3>Quarter Full Fony Ink</h3>

                            <p>Get <span>4000</span> Fony ink to writer your next story</p>
                        
                            <span className="price">
                                <span className="amount">$15</span>
                                <span className="user">user / month</span>
                            </span>
                        </div>

                        <hr />

                        <div className="middle">
                            {
                                quaterFull.map((item, idx) => (
                                    <div className="item">
                                        <span className={`checkBox ${item.active ? 'yes' : 'no'}`}>
                                            {
                                                item.active ? <CheckIcon /> : <CloseIcon />
                                            }
                                        </span>
                                        <p>{item.title}</p>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="foot">
                            <Link className='link'>Get Fony Ink</Link>
                        </div>
                    </div>
                </div>

                <div className="card card-2">
                    <div className="content">
                        <div className="head">
                            <img className='badge' src={BadgeImg} alt='most popular price' />
                            <img src={Beaker2} alt='quater ink' />

                            <h3>Half Full Fony Ink</h3>

                            <p>Get <span>12000</span> Fony ink to writer your next story</p>
                        
                            <span className="price">
                                <span className="amount">$25</span>
                                <span className="user">user / month</span>
                            </span>
                        </div>

                        <hr />

                        <div className="middle">
                            {
                                halfFull.map((item, idx) => (
                                    <div className="item">
                                        <span className={`checkBox ${item.active ? 'yes' : 'no'}`}>
                                            {
                                                item.active ? <CheckIcon /> : <CloseIcon />
                                            }
                                        </span>
                                        <p>{item.title}</p>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="foot">
                            <Link className='link'>Get Fony Ink</Link>
                        </div>

                    </div>
                </div>

                <div className="card card-3">
                    <div className="content">
                        <div className="head">
                            <img src={Beaker2} alt='quater ink' />

                            <h3>Fully Full Fony Ink</h3>

                            <p>Get <span>20000</span> Fony ink to writer your next story</p>
                        
                            <span className="price">
                                <span className="amount">$39</span>
                                <span className="user">user / month</span>
                            </span>
                        </div>

                        <hr />

                        <div className="middle">
                            {
                                fullyFull.map((item, idx) => (
                                    <div className="item">
                                        <span className={`checkBox ${item.active ? 'yes' : 'no'}`}>
                                            {
                                                item.active ? <CheckIcon /> : <CloseIcon />
                                            }
                                        </span>
                                        <p>{item.title}</p>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="foot">
                            <Link className='link'>Get Fony Ink</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PricingBanner