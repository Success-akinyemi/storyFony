import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
import './CreateStory.css'
import LogoImg from '../../assets/icon.png'
import EditPen from '../../assets/editpen.png'
import { useState } from 'react'

function CreateStory() {
    const [ card, setCard ] = useState('content1')

  return (
    <div className='createStory'>
        <AuthUserNavbar enableScrollEffect={false} miniNav={true} />
        
        <div className="conatiner">
            <div className="slide"></div>

            {
                card === 'content1' && (
                    <div className='content1'>
                        <h3><img src={LogoImg} alt='logo'/> Hey Famous Writer, what will you like  to write today</h3>
                        
                        <div className="cards">
                            <p>Select the type of story book you want to write</p>
                            
                            <div className="cardContainer">
                                <div className="card">
                                    <span>
                                        <img src={EditPen} alt='edit pen icon' className='editPen' />
                                    </span>
                                    
                                    <div className="text">
                                        <h4>Write short story</h4>

                                        <p>Generate a captivating beautiful short story within 2500 words.</p>
                                    </div>
                                </div>

                                <div className="card">
                                    <span>
                                        <img src={EditPen} alt='edit pen icon' className='editPen' />
                                    </span>
                                    
                                    <div className="text">
                                        <h4>Write long story</h4>

                                        <p>Develop your very own story with chapter within 8000 words like pro.</p>
                                    </div>
                                </div>

                                <div className="card">
                                    <span>
                                        <img src={EditPen} alt='edit pen icon' className='editPen' />
                                    </span>
                                    
                                    <div className="text">
                                        <h4>Write story series</h4>

                                        <p>Imagine been able to create a story series around 20,000 words.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="btn" onClick={() => setCard('content2')}>Proceed</div>
                    </div>
                )
            }

            {
                card === 'content2' && (
                    <div className='content2'>
                        <h3><img src={LogoImg} alt='logo'/> Hey, Famous writer, you’re writing a story series</h3>
                        
                        <div className="cards">
                            <p>Select the story genre you want. You can select upto 3 genres.</p>
                            
                            <div className="cardContainer">
                                {
                                    
                                }
                            </div>
                        </div>

                        <div className="btn" onClick={() => setCard('content1')}>Proceed</div>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default CreateStory