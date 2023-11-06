import './Reviews.css'

function Reviews({ name }) {
  return (
    <div className='reviews'>
        <div className={` ${ name === 'useCaseReview' ? 'useCaseReview' : 'reviewCard'}`}>
            Re
        </div>
    </div>
  )
}

export default Reviews