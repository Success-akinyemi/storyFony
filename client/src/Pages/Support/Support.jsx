import { useSelector } from 'react-redux'
import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
import Footer from '../../Components/Footer/Footer'
import { reasonForContacting } from '../../data/supporPage'
import './Support.css'

function Support() {
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data

  return (
    <div className='support'>
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className='supportHero'>
            <div className="content">
                <h1>Support</h1>
                <p>We are here to answer all your queries. Get in touch and the right team will get back to you in the next 2 hours.</p>
            </div>

            <div className="supportCard">
                <h1>Mail us</h1>
                <div className="supportform">
                    <div className="inputContainer">
                        <div className="inputCard">
                            <label>Name</label>
                            <input defaultValue={user?.name} type="text" />
                        </div>

                        <div className="inputCard">
                            <label>Pen Name</label>
                            <input defaultValue={user?.penName} type="text" />
                        </div>
                    </div>
                    <div className="inputContainer">
                        <div className="inputCard">
                            <label>Email</label>
                            <input defaultValue={user?.email} disabled type="email" />
                        </div>

                        <div className="inputCard">
                            <label>Country</label>
                            <input defaultValue={user?.country} type="text" />
                        </div>
                    </div>
                    <div className="inputContainer">
                        <div className="inputCard">
                            <label>Reason for contacting us</label>
                            <select>
                                {reasonForContacting.map((item, idx) => (
                                    <option value="" key={idx}>{item.text}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="inputContainer">
                        <div className="inputCard">
                            <label>Message</label>
                            <textarea name="" id="" cols="30" rows="10"></textarea>
                        </div>
                    </div>
                </div>
                
                <div className="btn">
                    <button>
                        Submit Message
                    </button>
                </div>
            </div>
        </div>
        
        <div className="footerCard">
            <Footer />
        </div>
    </div>
  )
}

export default Support