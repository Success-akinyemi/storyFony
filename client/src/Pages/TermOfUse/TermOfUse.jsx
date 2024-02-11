import React from 'react'
import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
import { closureNote, termsAndConditions, welcomeNote } from '../../data/termOfUse'
import './TermOfUse.css'
import Footer from '../../Components/Footer/Footer'

function TermOfUse() {
  return (
    <div className='termOfUse'>
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className="conatiner">
          <div className="content">
                <h1>Terms of use</h1>
                <p>Updated on 10th July 2023</p>
          </div>

          <div className="termCard">
              <h1>Mail us</h1>

              <div className="termContent">
                <h2>**Terms of Use for StoryFony AI**</h2>

                <h2>Effective Date: [Date]</h2>

                <p>{welcomeNote.text}</p>

                {
                    termsAndConditions.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <h3>{`**${idx + 1} ${item.title}**`}</h3>

                            <p dangerouslySetInnerHTML={{ __html: item.text }} />
                        </React.Fragment>
                    ))
                }

                <p className='footNote'>{closureNote.text}</p>
              </div>
          </div>
        </div>

        <div className="foot">
          <Footer />
        </div>
    </div>
  )
}

export default TermOfUse