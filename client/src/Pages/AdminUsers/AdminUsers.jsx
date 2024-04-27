import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import './AdminUsers.css'
import '../../style/admin.css'
import AdminNav from '../../Components/AdminNav/AdminNav'
import { useFetch } from '../../hooks/fetch.hooks'
import Spinner from '../../Components/Helpers/Spinner/Spinner'
import DotImg from '../../assets/more.png'
import { useState } from 'react'

function AdminUsers() {
    const { apiData, isLoading } = useFetch()
    const userData = apiData?.data
    const sortedDataArray = userData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const thisMonth = apiData?.thisMonth
    const percentage = apiData?.percentage

    const today = new Date();

    //pagination    
    const itemsPerPage = 10
    const [ currentPage, setCurrentPage ] = useState(1)
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedDataArray?.slice(indexOfFirstItem, indexOfLastItem)

    const totalNumberOfPages = Math.ceil(sortedDataArray?.length / itemsPerPage)

  return (
    <div className='adminCss adminUsers'>
        <div className="adminHeroBg">

        </div>
        <div className="adminContainer">
            <div className="adminSide">
                <AdminSidebar />
            </div>

            <div className="adminBody">
                <AdminNav title={'Users'} />

                <div className="adminMainCard">
                    <div className="cards">
                        <div className="card">
                            <h2>Total user</h2>
                            <h1>{userData?.length}</h1>
                            <span>{percentage}% more than last month</span>
                        </div>
                        <div className="card">
                            <h2>New user</h2>
                            <h1>{thisMonth}</h1>
                        </div>
                    </div>

                    <div className="users">
                        <p>All users</p>

                        <div className="content">
                            {
                                isLoading ? (
                                    <Spinner />
                                ) : (
                                    currentItems?.map((item) => (
                                            <div className='cardContent'>
                                                <div>
                                                    <img src={item?.profileImg} alt='user profile' />
                                                    <p>{item?.name}</p>
                                                </div>
                                                <div>{item?.email}</div>
                                                <div>{item?.country}</div>
                                                <div>{item?.planName}</div>
                                                <div>{new Date(item?.planEndDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })}</div>
                                                <div className={`${new Date(item?.planEndDate) > today ? 'future' : 'past'}`}>
                                                    <span></span>
                                                    <p>
                                                        {new Date(item?.planEndDate) > today ? 'Active' : 'Inactive'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <img src={DotImg} alt='menu' />
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

export default AdminUsers