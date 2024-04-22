import { Link } from 'react-router-dom'
import './StoryCard.css'
import MoreImg from '../../../assets/more.png'
import heartImg from '../../../assets/heart.png'
import BorderHeartImg from '../../../assets/borderHeart.png'
import { useEffect, useState } from 'react'
import { deleteStory, handlePrivateStory, likeStory } from '../../../helpers/api'
import { useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'


function StoryCard({ data, setSelectedCard, setShareStoryId }) {
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const [ isLoading, setIsLoading ] = useState(false)
    const [ uploadingLike, setUplaodingLike ] = useState(false)
    const [ liked, setIsLiked ] = useState()

    useEffect(() => {
        const isUserLiked = data?.likes?.includes(user._id);
        setIsLiked(isUserLiked);
    }, [data?.likes, user._id]);
    //console.log('LIKE', liked)


    const handleTogglePrivateStory = async (id) => {
        try {
            setIsLoading(true)
            const userId = user?._id
            const res = await handlePrivateStory({id, userId})
        } catch (error) {
            console.log('ERROR TOGGLING STORY', error)
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
            if(res?.data.success){
                //console.log('Previous liked state:', liked);
                setIsLiked((prev) => !prev);
                //console.log('New liked state:', liked);
            }
        } catch (error) {
            
        } finally{
            setUplaodingLike(false)
        }
    }

    const handleShare = async () => {
        if(user?.email === data?.email && data.privateStory === true){
            toast.error('You can only share public story')
            return;
        }

        if(user?.email === data?.email || data.privateStory === false){
            setSelectedCard('shareStoryToSocialMedia')
            setShareStoryId(data?._id)
        }
    }

    const handleDelete = async () => {
        const confirm = window.confirm(`Hey, Are you sure you want to delete this story: ${data?.storyTitle ? data?.storyTitle : data?.userTitle}`)
        if(confirm){
            try {
                const storyId = data?._id
                const userId = user?._id
                const res = await deleteStory({ storyId, userId })
            } catch (error) {
                console.log('first')
            }
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
                        uploadingLike ? (
                            ''
                        ) : (
                            <>
                                {
                                    liked ? (
                                        <img src={heartImg} onClick={() => handleLike('remove')} className='heart' alt='heart' />
                                    ) : (
                                        <img src={BorderHeartImg} onClick={() => handleLike('add')}  className='heart' alt='heart' />
                                    )
                                }
                            </>
                        )
                    }
                    <p>{data?.likes?.length}</p>
                    {/**console.log('first',data?.likes?.length)*/}

                    <div className="moreImg">

                        <img src={MoreImg} alt='more' className='more' />
                        <div className="moreCard">
                            {
                                user?.email === data?.email ? (
                                    <Link to={`/story-editor/${user?._id}/${data?._id}`} className='link moreCardLink'>Edit story</Link>
                                ) : (
                                    ''
                                )
                            }
                            {
                                user?.email === data?.email || data.privateStory === false ? (
                                    <Link className='link moreCardLink' onClick={handleShare}>Share story</Link>
                                ) : (
                                    ''
                                )
                            }
                            <span onClick={() => handleTogglePrivateStory(data?._id)} className='link moreCardLink'>{ isLoading ? 'Updating...' : `${data?.privateStory ? 'Make Public' : 'Make Private'} `}</span>
                            <Link className='link moreCardLink'>Publish</Link>
                            {
                                user?.email === data?.email ? (
                                    <span className='link moreCardLink delete' onClick={handleDelete}>Delete</span>
                                ) : (
                                    ''
                                )
                            }
                        </div>
                    </div>

                </div>


            </div>
        </div>
    </div>
  )
}

export default StoryCard