import './AdminStories.css'
import '../../style/admin.css'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import AdminNav from '../../Components/AdminNav/AdminNav'


function AdminStories() {
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
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminStories