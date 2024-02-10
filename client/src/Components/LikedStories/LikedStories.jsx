import { Link, useNavigate } from 'react-router-dom';
import './LikedStories.css'
import { userLikedStory } from '../../hooks/fetch.hooks';
import Spinner from '../Helpers/Spinner/Spinner';
import { useState } from 'react';
import LogoImg from '../../assets/icon.png'
import toast from 'react-hot-toast';
import StoryCard from '../Helpers/StoryCard/StoryCard';

function LikedStories({setSelectedCard, setShareStoryId}) {
  const { apiUserStoryData, isLoadingStory, storyStatus, storyServerError } = userLikedStory();
  const dataa = apiUserStoryData?.data
  const navigate = useNavigate()

  const data = dataa

  if(storyStatus === 401 || storyStatus === 403){
    toast.error(storyServerError)
    navigate('/login')
  }

  //Pagination
  const itemsPerPage = 12
  const [ currentPage, setCurrentPage ] = useState(1)
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem)

  const totalNumberOfPages = Math.ceil(data?.length / itemsPerPage)

  if(isLoadingStory) return <Spinner />
  return (
    <div className='likedStories'>
        <h3>Liked stories</h3>

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
                                <StoryCard data={item} setSelectedCard={setSelectedCard} setShareStoryId={setShareStoryId} />
                            </div>
                        ))
                    }
                </div>
            <div className="paginationBtn">
                {
                    data?.length > 0 ? (
                        <span>page {currentPage} of {totalNumberOfPages} </span>
                    ) : ('')
                }
                <div className="btn">
                    {
                        currentPage > 1 && (
                            <button 
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='btn1'
                            >
                                Back
                            </button>
                        )
                    }
                    {
                        totalNumberOfPages > 1 && currentPage < totalNumberOfPages ? (
                            <button 
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={indexOfLastItem >= data?.length}
                                className='btn2'
                            >
                                Next
                            </button>
                        ) : ('')
                    }
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default LikedStories