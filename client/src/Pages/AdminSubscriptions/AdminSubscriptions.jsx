import './AdminSubscriptions.css'
import '../../style/admin.css'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import AdminNav from '../../Components/AdminNav/AdminNav'
import { useFetchSubscriptionData } from '../../hooks/fetch.hooks'
import Spinner from '../../Components/Helpers/Spinner/Spinner'
import { useState } from 'react'

function AdminSubscriptions() {
  const { apiUserSubsData, isLoadingSubs } = useFetchSubscriptionData()
  const data = apiUserSubsData?.data
  const totalSum = data?.reduce((sum, item) => sum + item.amount, 0);
  const sortedDataArray = data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      //pagination    
      const itemsPerPage = 9
      const [ currentPage, setCurrentPage ] = useState(1)
      
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = sortedDataArray?.slice(indexOfFirstItem, indexOfLastItem)
  
      const totalNumberOfPages = Math.ceil(sortedDataArray?.length / itemsPerPage)

      
  return (
    <div className='adminCss adminSubscriptions'>
        <div className="adminHeroBg">

        </div>
        <div className="adminContainer">
            <div className="adminSide">
                <AdminSidebar />
            </div>

            <div className="adminBody">
                <AdminNav title={'Subscriptions'} />

                <div className="adminMainCard">
                  <div className="cards">
                      <div className="card">
                            <p>Total sales</p>
                            <h1>${ totalSum ? totalSum/2 : ''}</h1>
                        </div>
                        <div className="card">
                            <p>New subscription</p>
                            <h1>{ apiUserSubsData ? apiUserSubsData?.thisMonthTotal / 2 : ''}</h1>
                            <span>{apiUserSubsData?.percentageTotal}% more than last month</span>
                        </div>
                  </div>

                  <div className="subs">
                      <div className='top'>
                        <span>All users</span>
                        <span>Plan</span>
                        <span>Fee</span>
                        <span>Payment means</span>
                        <span>Date</span>
                        <span>Status</span>
                      </div>

                      <div className='body'>
                        {
                          isLoadingSubs ? (
                            <Spinner />
                          ) : (
                            currentItems.map((item) => (
                              <div className="card">
                                <div>
                                  <img src={item?.profileImg} alt='profile' />
                                  <p>{item?.name}</p>
                                </div>
                                <div>{item?.planType}</div>
                                <div>${item?.amount}</div>
                                <div>Credit Card</div>
                                <div>{new Date(item?.endDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })}</div>
                                <div className={new Date(item?.endDate) > new Date() ? 'success' : 'fail'}>
                                  <span></span>
                                  <p>{new Date(item?.endDate) > new Date() ? 'Active' : 'Inactive'}</p>
                                </div>
                              </div>
                            ))
                          )
                        }
                      </div>

                      <div className="pagination">
                            <p>page {currentPage} of {totalNumberOfPages}</p>
                            <div className="btns">
                        {
                            currentPage > 1 && (
                                <button 
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className='btn'
                                >
                                    Back
                                </button>
                            )
                        }
                        {
                            totalNumberOfPages > 1 && currentPage < totalNumberOfPages ? (
                                <button 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={indexOfLastItem >= sortedDataArray?.length}
                                    className='btn'
                                >
                                    Next
                                </button>
                            ) : ('')
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

export default AdminSubscriptions