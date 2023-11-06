import './UseCasesBanner.css'
import PenIcon from '../../assets/pen.png'
import { Link } from 'react-router-dom'

function UseCasesBanner({ data }) {
  return (
    <div className='useCasesBanner'>
      {
        data.map((item) => (   
          <Link className='link' to='/use-case'>
            <div className="conatiner" key={item._id}>
                <div className="title">
                    <span className="pack"><img src={PenIcon} alt='editing pen' className='packIcon' /></span>
                    <h2 className="head">{item.title}</h2>
                </div>

                <p className="text">{item.text}</p>

                <div className="image">
                  <img src={item.image} alt={item.title} />
                </div>
            </div>
          </Link>       
        ))
      }
    </div>
  )
}

export default UseCasesBanner