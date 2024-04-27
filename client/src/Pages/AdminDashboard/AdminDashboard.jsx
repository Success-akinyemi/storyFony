import AdminNav from '../../Components/AdminNav/AdminNav'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import './AdminDashboard.css'
import '../../style/admin.css'
import WalletImg from '../../assets/wallet.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetchSubscriptionData } from '../../hooks/fetch.hooks'
import Spinner from '../../Components/Helpers/Spinner/Spinner'

function AdminDashboard() {
    const [ timeRange, setTimeRange ] = useState('wk')
    const { apiUserSubsData, isLoadingSubs } = useFetchSubscriptionData()
    const data = apiUserSubsData?.data
    const totalSum = data?.reduce((sum, item) => sum + item.amount, 0);
    const sortedDataArray = data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const spliceData = sortedDataArray?.slice(0, 5);

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
                                <h1>${apiUserSubsData?.thisMonthAmount / 2}</h1>
                                <span>{apiUserSubsData?.percentageAmount}% more than last month</span>
                            </div>
                        </div>
                        <div className="card">
                            <p>New subscription</p>
                            <h1>{apiUserSubsData?.thisMonthTotal / 2}</h1>
                            <span>{apiUserSubsData?.percentageTotal}% more than last month</span>
                        </div>
                        <div className="card">
                            <p>Total subscription</p>
                            <h1>${totalSum/2}</h1>
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

                            <div className="down">
                                {
                                    isLoadingSubs ? (
                                        <Spinner />
                                    ) : (
                                        spliceData?.map((item) => (
                                            <div className='card'>
                                                <div>
                                                    <img src={item?.profileImg} alt='profile' />
                                                    <p>{item?.name}</p>
                                                </div>
                                                <div>${item?.amount}</div>
                                                <div>{new Date(item?.endDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })}</div>
                                                <div className={item?.success ? 'success' : 'fail'}>
                                                    <span></span>
                                                    <p>{item?.success ? 'Successful' : 'Failed'}</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
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