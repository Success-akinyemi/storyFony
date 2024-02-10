import { useLocation } from 'react-router-dom'
import './StoryBook.css'
import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
//import { storyData } from '../../data/storybook'
import { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userStoryBook } from '../../hooks/fetch.hooks'
import Spinner from '../../Components/Helpers/Spinner/Spinner'
import parser from 'html-react-parser'
import { useSelector } from 'react-redux';
import HeartImg from '../../assets/heart.png'
import BorderHeartImg from '../../assets/borderHeart.png'


function StoryBook() {
    const loc = useLocation()
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const [ query, setQuery ] = useState({})
    const [storyData, setStoryData] = useState(null);
    const [ currentPage, setCurrentPage ] = useState(1)
    useEffect(() => {
        const userId = loc.pathname.split('/')[2]
        const storyId = loc.pathname.split('/')[3]
        setQuery({ userId, storyId });
      }, []);
    console.log(query)
    const { isLoadingStory, apiUserStoryData } = userStoryBook(query)

    useEffect(() => {
      if (!isLoadingStory && apiUserStoryData?.data) {
        setStoryData(apiUserStoryData.data);
      }
    }, [isLoadingStory, apiUserStoryData]);

    if (isLoadingStory || !storyData) return <div className='StoryBookloadingState'><Spinner /></div>;
    //const storyData = apiUserStoryData?.data
    console.log('storyData',storyData)
    const { storyTitle, authorPenName, privateStory, motive, coverImage, storyImage, story, likes, createdAt, authorImg, userTitle } = storyData

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

          const isUserLiked = likes?.includes(user._id)

  return (
    <div className='storyBook'>
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className="coverImage">
            <div className="layer"></div>
            <img className='coverImg' src={coverImage} alt={`the story: ${storyTitle}`} />
        </div>

        <div className="topHeader">
            <div className="up">
                <div></div>
                <h1>{storyTitle ? storyTitle : userTitle}</h1>
                <div className='footNote'>
                    <span className='s-1'>Created on: {formattedDate}</span>
                    <span className="s-2">{privateStory ? 'Private story' : 'Public story'}</span>
                    <span className="s-3">
                        <div className="authorImg">
                            {
                                authorImg ? (
                                    <img src={authorImg} />
                                ) : (
                                    ''
                                )
                            }
                        </div>
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
                <h2>{storyTitle ? storyTitle : userTitle}</h2>
                <img className='storyImg' src={storyImage} alt={`the story: ${storyTitle}`} />
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
                                        <div className="chapterStory">{parser(item.chapterContent)}</div>
                                    </div>
                                </div>
                                <div className="right">
                                <img className='storyPicture' src={item?.chapterImage} alt={`story ${item.chapterNumber}`} />
                                </div>
                            </div>
                        ) : (
                            <div className="container-2" key={item._id}>
                                <div className="left">
                                    <div className="titleCard">{item.chapterNumber}</div>
                                    <div className='storyCard'>
                                        <div className="chapterTitle">{item.chapterTitle}</div>
                                        <div className='chapterStory'>{parser(item.chapterContent)}</div>
                                    </div>
                                </div>
                                <div className="right">
                                    <img className='storyPicture' src={coverImage} alt={`story ${item.chapterNumber}`} />
                                </div>
                            </div>
                        )}
                    </div>
                ))
            }
            <span className='pageNumber'>Story page {currentPage} of {totalNumberOfPages} </span>
            <footer>
            <div className="btn">
    {currentPage === totalNumberOfPages ? (
        <div className="btn1">
            <button
                onClick={() => setCurrentPage(prevPage => prevPage - 1)}
                disabled={currentPage === 1}
                className='btn5'
            >
                Previous page
            </button>
            <button
                className='btn3'
                disabled={indexOfLastItem >= story.length}
                onClick={() => setCurrentPage(currentPage + 1)}
            >
                End of Story
            </button>
        </div>
    ) : (
        <div className="btn4">
            <button
                onClick={() => setCurrentPage(prevPage => prevPage - 1)}
                disabled={currentPage === 1}
                className='btn5'
            >
                Previous page
            </button>
            <button
                onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                disabled={indexOfLastItem >= story.length}
                className='btn2'
            >
                Continue to next part
            </button>
        </div>
    )}
</div>

                
                <div className="likeCard">
                    <div className={`likeBox ${isUserLiked ? 'red' : ''}`}>
                        {
                            isUserLiked 
                                ? 
                                <img  src={HeartImg} alt='heart for user who have liked the image' className='icon' />
                                :
                                <img  src={BorderHeartImg} alt='heart for user yet to like story' className='icon' />
                        }
                    </div>
                    <p>
                        {isUserLiked ? 
                            (
                                `you and ${likes.length - 1} others Liked this story`
                            ) : (
                                `${likes?.length} liked this story`
                            )
                        }
                    </p>
                </div>
            </footer>
        </div>
    </div>
  )
}

export default StoryBook