import { useSelector } from 'react-redux'
import './ShareOnSocialMedia.css'
import { FacebookShareButton } from 'react-share'

function ShareOnSocialMedia({shareStoryId}) {
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
  return (
    <div className='shareOnSocialMedia'>
        
        <FacebookShareButton 
            url={`https://storyfony.onrender.com/story-book/${user?._id}/${shareStoryId}`}
        >
            Share
        </FacebookShareButton>
    </div>
  )
}

export default ShareOnSocialMedia