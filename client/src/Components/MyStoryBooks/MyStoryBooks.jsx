import { Link } from 'react-router-dom';
import './MyStoryBooks.css'
import LogoImg from '../../assets/icon.png'
import { userStoryBook } from '../../hooks/fetch.hooks';
import StoryCard from '../Helpers/StoryCard/StoryCard';
import { myStoryData } from '../../data/myStoryData';
import { useState } from 'react';
import Spinner from '../Helpers/Spinner/Spinner';

function MyStoryBooks() {
    const { apiUserStoryData, isLoadingStory } = userStoryBook();
    const dataa = apiUserStoryData?.data

    const data = dataa

    //pagination
    const itemsPerPage = 12
    const [ currentPage, setCurrentPage ] = useState(1)
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem)

    const totalNumberOfPages = Math.ceil(data?.length / itemsPerPage)

    if(isLoadingStory) return <Spinner />
  return (
    <div className='myStoryBooks'>
        <h3>My story books</h3>

        <div className="container">
            <div className="card card-1">
                <Link to='/create-story' className='link newStoryLink'>
                    <img src={LogoImg} alt='Story fony logo' />
                    <p>Create new story book</p>
                </Link>
            </div>
            <div className='storyCard' >
                <div className="cards">
                    {
                        currentItems?.map((item, idx) => (
                            <div className="card card-2" key={idx}>
                                <div className="overlay"></div>
                                <StoryCard data={item} />
                            </div>
                        ))
                    }
                </div>
            <div className="paginationBtn">
                <span>page {currentPage} of {totalNumberOfPages} </span>
                <div className="btn">
                    <button 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='btn1'
                    >
                        Back
                    </button>
                    <button 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={indexOfLastItem >= data.length}
                        className='btn2'
                    >
                        Next
                    </button>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default MyStoryBooks