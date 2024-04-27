import './AdminSubscriptions.css'
import '../../style/admin.css'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import AdminNav from '../../Components/AdminNav/AdminNav'
import { useFetchSubscriptionData } from '../../hooks/fetch.hooks'

function AdminSubscriptions() {
  const { apiUserSubsData, isLoadingSubs } = useFetchSubscriptionData()
  const data = apiUserSubsData?.data
  const totalSum = data?.reduce((sum, item) => sum + item.amount, 0);
  const sortedDataArray = data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
                    <div className="card"></div>
                    <div className="card"></div>
                  </div>

                  <div className="subs">
                    
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminSubscriptions