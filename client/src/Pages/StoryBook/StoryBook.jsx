import { useLocation } from 'react-router-dom'
import './StoryBook.css'
import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
//import { storyData } from '../../data/storybook'
import { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userStoryBook } from '../../hooks/fetch.hooks'
import Spinner from '../../Components/Helpers/Spinner/Spinner'

function StoryBook() {
    const loc = useLocation()
    const path = loc.pathname.split('/')[2]
    const { isLoadingStory, apiUserStoryData } = userStoryBook(path)
    const [storyData, setStoryData] = useState(null);
    const [ currentPage, setCurrentPage ] = useState(1)

    useEffect(() => {
      if (!isLoadingStory && apiUserStoryData?.data) {
        setStoryData(apiUserStoryData.data);
      }
    }, [isLoadingStory, apiUserStoryData]);

    if (isLoadingStory || !storyData) return <Spinner />;
    //const storyData = apiUserStoryData?.data
    console.log('storyData',storyData)
    const { storyTitle, authorPenName, privateStory, motive, coverImage, storyImage, story, likes, createdAt } = storyData

        //pagination
        const itemsPerPage = 2
        
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = story?.slice(indexOfFirstItem, indexOfLastItem)
    
        const totalNumberOfPages = Math.ceil(story?.length / itemsPerPage)
        
        // format date
        const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          });

  return (
    <div className='storyBook'>
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className="coverImage">
            <div className="layer"></div>
            <img className='coverImg' src={`data:image/*;base64, ${coverImage}`} alt={`the story: ${storyTitle}`} />
        </div>

        <div className="topHeader">
            <div className="up">
                <div></div>
                <h1>{storyTitle}</h1>
                <div className='footNote'>
                    <span className='s-1'>Created on: {formattedDate}</span>
                    <span className="s-2">{privateStory ? 'Private story' : 'Public story'}</span>
                    <span className="s-3">
                        <div className="authorImg"></div>
                        <p>@{authorPenName}</p>
                    </span>
                </div>
            </div>
            <div className="down">
                {motive}
            </div>

        </div>

        <div className='storyImage'>
            <div className="card">
                <h2>{storyTitle}</h2>
                <img className='storyImg' src={`data:image/*;base64, ${storyImage}`} alt={`the story: ${storyTitle}`} />
            </div>
        </div>

        <div className="menuCard"></div>

        <div className="content">
            <p>Lets dive in!</p>
            {
                currentItems.map((item) => (
                    <div>
                        {item.chapterImage ? (
                            <div className="container-1" key={item._id}>
                                <div className="left">
                                    <div className="titleCard">{item.chapterNumber}</div>
                                    <div className="storyCard">
                                        <div className="chapterTitle">{item.chapterTitle}</div>
                                        <div className="chapterStory">{item.chapterContent}</div>
                                    </div>
                                </div>
                                <div className="right">
                                <img className='storyPicture' src={`data:image/*;base64, ${item?.chapterImage}`} alt={`story ${item.chapterNumber}`} />
                                </div>
                            </div>
                        ) : (
                            <div className="container-2" key={item._id}>
                                <div className="left">
                                    <div className="titleCard">{item.chapterNumber}</div>
                                    <div className='storyCard'>
                                        <div className="chapterTitle">{item.chapterTitle}</div>
                                        <div className='chapterStory'>{item.chapterContent}</div>
                                    </div>
                                </div>
                                <div className="right">
                                    <img className='storyPicture' src={`data:image/*;base64, ${coverImage}`} alt={`story ${item.chapterNumber}`} />
                                </div>
                            </div>
                        )}
                    </div>
                ))
            }
            <span className='pageNumber'>Story page {currentPage} of {totalNumberOfPages} </span>
            <footer>
                <div className="btn">
                    {
                        currentPage === 1 ? (
                            <div className="btn1">
                                <button 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={indexOfLastItem >= story.length}
                                    className='btn3'
                                >
                                    {currentPage === 1 ? 'End of Story' : 'Continue to next part'}
                                </button>
                            </div>
                        ) : (
                            <div className="btn4">
                                <button 
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className='btn5'
                                >
                                    previous page
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={indexOfLastItem >= story.length}
                                    className='btn2'
                                >
                                    {currentPage === 1 ? 'End of Story' : 'Continue to next part'}
                                </button>
                            </div>
                        )
                    }
                </div>
                
                <div className="likeCard">
                    <div className="likeBox"><FavoriteBorderIcon className='icon' /></div>
                    <p>{likes} Liked this story</p>
                </div>
            </footer>
        </div>
    </div>
  )
}

export default StoryBook