import './StarRating.css'
import StarImg from '../../../assets/star.png'
function StarRating({ count }) {

  const stars = new Array(count).fill(null);

  return (
    <div className='starRating'>
      {
        stars.map((star, index) => (
          <img src={StarImg} alt={`${count} star rating`} key={index} className='starIcon' />
        ))
      }
    </div>
  )
}

export default StarRating