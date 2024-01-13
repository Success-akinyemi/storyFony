import './Reviews.css'
import { reviews } from '../../data/reviews'

import PersonImage from '../../assets/person.png'
import CoverImage from '../../assets/bookCover.png'
import { useState } from 'react'


function Reviews({ name }) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  }

  const handlePrevReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev -1));
  }

  const currentReview = reviews[currentReviewIndex];

  return (
    <div className='reviews'>
        <div className={` ${ name === 'useCaseReview' ? 'useCaseReview' : 'reviewCard'}`}>
            <div className="imageCard">
              <img src={currentReview.coverImage} alt="" className="reviewImg" />
            </div>

            <div className='reviewBody'>
              <div className="reviewText">
                <p>{currentReview.review}</p>
              </div>
              <div className="sliders">
                  <div className="bar"></div>
                  <div className="btns">
                    <button onClick={handlePrevReview} className="s1">&lt;</button>
                    <button onClick={handleNextReview} className="s2">&gt;</button>
                  </div>
              </div>
              
              <div className="person">
                <img src={currentReview.personImage} alt="" className="personImg" />

                <div className='personInfo'>
                  <p className="personName">{currentReview.personName}</p>
                  <p className="personRole">{currentReview.personRole}</p>
                  <p className="personCompany">{currentReview.personCompany}</p>
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Reviews