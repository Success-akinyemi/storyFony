import AdminNav from '../../Components/AdminNav/AdminNav'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import './AdminDashboard.css'
import '../../style/admin.css'
import WalletImg from '../../assets/wallet.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetchSubscriptionData } from '../../hooks/fetch.hooks'

function AdminDashboard() {
    const [ timeRange, setTimeRange ] = useState('wk')
    const { apiUserSubsData, isLoadingSubs } = useFetchSubscriptionData()
    console.log(apiUserSubsData?.data)

  return (
    <div className='adminCss adminDashboard'>
        <div className="adminHeroBg">

        </div>
        <div className="adminContainer">
            <div className="adminSide">
                <AdminSidebar />
            </div>

            <div className="adminBody">
                <AdminNav title={'Overview'} />

                <div className="adminMainCard">
                    <div className="cards">
                        <div className="card">
                            <img src={WalletImg} alt='wallet' />
                            <div className="info">
                                <p>Current profit</p>
                                <h1>$17,000.00</h1>
                                <span>8% more than last month</span>
                            </div>
                        </div>
                        <div className="card">
                            <p>New subscription</p>
                            <h1>78</h1>
                            <span>8% more than last month</span>
                        </div>
                        <div className="card">
                            <p>Total subscription</p>
                            <h1>$780,000.00</h1>
                        </div>
                    </div>

                    <div className="subs">
                        <div className="box">
                            <div className="headInfo">
                                <div className="left">
                                    <h1>₦70,000.00</h1>
                                    <span>Total subscription this week</span>
                                </div>

                                <div className="right">
                                    <div className={`btn ${timeRange === 'wk' ? 'active' : ''}`} onClick={() => setTimeRange('wk')}>W</div>
                                    <div className={`btn ${timeRange === 'mth' ? 'active' : ''}`} onClick={() => setTimeRange('mth')}>M</div>
                                    <div className={`btn ${timeRange === 'yr' ? 'active' : ''}`} onClick={() => setTimeRange('yr')}>Y</div>
                                </div>
                            </div>

                            <div className="bottom"></div>
                        </div>
                        
                        <div className="box">
                            <div className="up">
                                <h3>Recent subscription</h3>
                                <Link className="link">View all</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminDashboard