import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import './AdminUsers.css'
import '../../style/admin.css'
import AdminNav from '../../Components/AdminNav/AdminNav'
import { useFetch } from '../../hooks/fetch.hooks'


function AdminUsers() {
    const { apiData, isLoading } = useFetch()
    
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
                            <h1>1200</h1>
                            <span>8% more than last month</span>
                        </div>
                        <div className="card">
                            <h2>New user</h2>
                            <h1>78</h1>
                        </div>
                    </div>

                    <div className="users">
                        <p>All users</p>

                        <div className="content"></div>

                        <div className="pagination">
                            <p>Page 2 of 4</p>
                            <div className="btns">
                                <div className="btn">Back</div>
                                <div className="btn">Next</div>
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