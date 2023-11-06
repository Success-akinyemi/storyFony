import { Link } from 'react-router-dom';
import './MyStoryBooks.css'
import LogoImg from '../../assets/icon.png'
import { userStoryBook } from '../../hooks/fetch.hooks';

function MyStoryBooks() {
    const { apiUserStoryData, isLoadingStory } = userStoryBook();
    const data = apiUserStoryData
  return (
    <div className='myStoryBooks'>
        <h3>My story books</h3>

        <div className="container">
            <div className="card card-1">
                <Link className='link newStoryLink'>
                    <img src={LogoImg} alt='Story fony logo' />
                    <p>Create new story book</p>
                </Link>
            </div>
            {
                data?.map((item) => (
                    <div className="card card-2"></div>
                ))
            }
        </div>
    </div>
  )
}

export default MyStoryBooks