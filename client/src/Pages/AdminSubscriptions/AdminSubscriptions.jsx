import './AdminSubscriptions.css'

function AdminSubscriptions() {
  return (
    <div className='adminCss adminSubscriptions'>
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

export default AdminSubscriptions