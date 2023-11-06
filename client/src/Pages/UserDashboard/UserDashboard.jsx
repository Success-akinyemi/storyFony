import './UserDashboard.css'

function UserDashboard() {
  return (
    <div className='userDashboard'>
            <div className="userDashboardHero">
            <div className="content">
                <h1>StoryFony AI - The #1 Best AI bedtime story generator in 2023</h1>
                <p>Imagine being able to create bedtime story from your imagination in a minute</p>

                <div className="card">
                    <p>Watch demo video</p>

                    <div className="image">
                        <img src={PreviewArrow} alt='preview arrow' />
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default UserDashboard