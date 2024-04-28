import './AdminStories.css'
import '../../style/admin.css'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import AdminNav from '../../Components/AdminNav/AdminNav'
import { useFetchStories } from '../../hooks/fetch.hooks'


function AdminStories() {
    const { apiData, isLoading } = useFetchStories()
    const data = apiData?.data

  return (
    <div className='adminCss adminStories'>
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
                            <p>Total stories created</p>
                            <h1>{data?.length}</h1>
                        </div>
                        <div className="card">
                            <p>New stories</p>
                            <h1>{ apiData ? apiData?.thisMonth : ''}</h1>
                            <span>{apiData?.percentage}% more than last month</span>
                        </div>
                  </div>

                  <div className="content">
                    <h1>Adventure stories</h1>
                    <div className="cardContent">
                        {
                            
                        }
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminStories