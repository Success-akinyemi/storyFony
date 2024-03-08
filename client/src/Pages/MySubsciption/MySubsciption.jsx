import './MySubsciption.css'
import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
import Footer from '../../Components/Footer/Footer'
import Beaker1 from '../../assets/beaker1.png'
import Beaker2 from '../../assets/beaker2.png'
import Beaker3 from '../../assets/beaker3.png'
import { useSelector } from 'react-redux'
import { userSub } from '../../data/userSubscription'
import { fetchUserSubscription } from '../../hooks/fetch.hooks'

function MySubsciption() {
    const { apiSubData, isLoadingSub } = fetchUserSubscription()
    const subData = apiSubData?.data
    console.log('SUB', subData)
    const sortedDataArray = subData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data

    const endDate = new Date(user?.planEndDate)
    const plantype = user?.planName
    
  return (
    <div className='mySubsciption' >
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className="container">
          <div className="content">
                <h1>My subscription</h1>
                <p>Impress your audience with interesting short stories created with StoryFony AI like pro</p>
          </div>

            <div className="card">
                <h1>My subscription</h1>

                <div className="infoCard">
                    <p>Your current plan</p>

                    <div className="sub">
                        <div className="subName">
                            <img src={plantype === 'basic' ? Beaker1 : plantype === 'standard' ? Beaker2 : Beaker3} alt='ink jar' />
                            <h2>{plantype === 'basic' ? 'Quarter Full Fony Ink' : plantype === 'standard' ? 'Half Full Fony Ink' : 'Fully Full Fony Ink'}</h2>
                        </div>
                        
                        <p>Next renewal date: {endDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })}</p>
                    </div>

                    <div className="actions">
                        <button className='cancel'>Cancel subscription</button>
                        <button className='manage'>Manage subscription</button>
                    </div>
                </div>

                <div className="subHistroy">
                    <p>Subscription history</p>

                    <div className="histroyTable">
                        <div className="histroyHeader">
                            <h3>Date</h3>
                            <h3>Type</h3>
                            <h3>Receipt</h3>
                        </div>
                        <div className="histroyInfo">
                            {
                                sortedDataArray?.map((item, idx) => (
                                    <div key={idx} className='histroyInfoCard'>
                                        <p className='text'>{new Date(parseInt(item?.startDate, 10)).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        <p className='text'>{item?.planType}</p>
                                        <p className='btn'>Download</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <div className="foot">
          <Footer />
        </div>
    </div>
  )
}

export default MySubsciption