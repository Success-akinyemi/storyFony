import { Link } from 'react-router-dom'
import './StoryCard.css'
import MoreImg from '../../../assets/more.png'
import heartImg from '../../../assets/heart.png'
import BorderHeartImg from '../../../assets/borderHeart.png'
import { useState } from 'react'
import { handlePrivateStory, likeStory } from '../../../helpers/api'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'


function StoryCard({ data }) {
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const [ isLoading, setIsLoading ] = useState(false)
    const [ uploadingLike, setUplaodingLike ] = useState(false)

    const isUserLiked = data?.likes?.includes(user._id)


    const handleTogglePrivateStory = async (id) => {
        try {
            setIsLoading(true)
            const userId = user?._id
            const res = await handlePrivateStory({id, userId})
        } catch (error) {
            console.log('ERROR CREATING STORY', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLike = async (plan) => {
        const userId = user?._id
        const storyId = data._id
        try {
            setUplaodingLike(true)
            const res = await likeStory({userId, storyId, plan})
        } catch (error) {
            
        } finally{
            setUplaodingLike(false)
        }
    }

  return (
    <div className='storyCard'>
        <Toaster position='top-center'></Toaster>
        <img src={data?.coverImage ? data?.coverImage : data?.storyImage} alt='background' className='background' />

        <span className="tag">{data?.genre}</span>

        <div className="content">
            <div className="top">
                <h1>{data?.storyTitle ? data?.storyTitle : data?.userTitle}</h1>

                <Link to={`/story-book/${user?._id}/${data?._id}`} className='link btn'>
                    Read story book
                </Link>
            </div>

            <div className="bottom">
                <div className="left">
                    <span className="authorImg">
                        { data?.authorImg && <img src={data?.authorImg} alt='author'/> }
                    </span>
                    <p>{data?.author}</p>
                </div>

                <div className="right">
                    {
                        isUserLiked ? (
                            <img src={heartImg} onClick={() => handleLike('remove')} className='heart' alt='heart' />
                        ) : (
                            <img src={BorderHeartImg} onClick={() => handleLike('add')}  className='heart' alt='heart' />
                        )
                    }
                    <p>{data?.likes?.length}</p>
                    {console.log('first',data?.likes?.length)}

                    <div className="moreImg">

                        <img src={MoreImg} alt='more' className='more' />
                        <div className="moreCard">
                            <Link to={`/story-editor/${user?._id}/${data?._id}`} className='link moreCardLink'>Edit story</Link>
                            <Link className='link moreCardLink'>Share story</Link>
                            <span onClick={() => handleTogglePrivateStory(data?._id)} className='link moreCardLink'>{ isLoading ? 'Updating...' : `${data?.privateStory ? 'Make Public' : 'Make Private'} `}</span>
                            <Link className='link moreCardLink'>Publish</Link>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    </div>
  )
}

export default StoryCard