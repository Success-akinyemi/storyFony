import { useState } from 'react'
import './FAQ.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AvatarGroup from '../../assets/Avatar-group.png'

function FAQ({ faq }) {
    const [ clicked, setClicked ] = useState(false)

    const toggle = idx => {
        if(clicked === idx){
            return setClicked(null)
        }

        setClicked(idx)
    }

  return (
    <div className='faq'>
        <div className="top">
            <div className='content'>
                <h1>Frequently asked questions</h1>
                <p>Everything you need to know about the product and billing.</p>
            </div>
        </div>

        <div className="middle">
            <div className='container'>
                {
                    faq.map((item, idx) => (
                        <div className="card">
                            <div className="title" onClick={() => toggle(idx)} key={idx}>
                                <h1>{item.qst}</h1>
                                <span>
                                    {
                                        clicked === idx ? <RemoveIcon /> : <AddIcon />
                                    }
                                </span>
                            </div>
                            {
                                clicked === idx ? (
                                    <div className="dropDown">
                                        <p>{item.ans}</p>
                                    </div>

                                ) : null
                            }
                        </div>
                    ))
                }
            </div>
        </div>

        <div className="bottom">
            <div className="card">
                <div className="image">
                    <img src={AvatarGroup} alt='avatar group' />
                </div>

                <div className="text">
                    <h3>Still have questions?</h3>
                    <p>Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
                </div>

                <div className="btn">
                    <a href="" className='link'>Get in touch</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FAQ