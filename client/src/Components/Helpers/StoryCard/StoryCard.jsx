import { Link } from 'react-router-dom'
import './StoryCard.css'
import MoreImg from '../../../assets/more.png'
import heartImg from '../../../assets/heart.png'
import { useState } from 'react'
import { handlePrivateStory } from '../../../helpers/api'
import { useSelector } from 'react-redux'


function StoryCard({ data }) {
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const { isLoading, setIsLoading } = useState(false)

    const handletogglePrivateStory = async (id) => {
        try {
            setIsLoading(true)
            const res = await handlePrivateStory({id})
        } catch (error) {
            console.log('ERROR CREATING STORY', error)
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <div className='storyCard'>
        <img src={data?.storyImage} alt='background' className='background' />

        <span className="tag">{data?.genre}</span>

        <div className="content">
            <div className="top">
                <h1>{data?.storyTitle}</h1>

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
                    <img src={heartImg} className='heart' alt='heart' />
                    <p>{data?.likes}</p>

                    <div className="moreImg">

                        <img src={MoreImg} alt='more' className='more' />
                        <div className="moreCard">
                            <Link to={`/story-editor/${user?._id}/${data?._id}`} className='link moreCardLink'>Edit story</Link>
                            <Link className='link moreCardLink'>Share story</Link>
                            <span onClick={handletogglePrivateStory(data?._id)} className='link moreCardLink'>{ isLoading ? 'Updating...' : `${data?.privateStory ? 'Private story' : 'Public story'} `}</span>
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