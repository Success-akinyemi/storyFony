import { useSelector } from 'react-redux'
import './StoryEditor.css'

function StoryEditor() {
  const  {currentUser}  = useSelector(state => state.user)
  const user = currentUser?.data

  return (
    <div className='storyEditor'>
        <div className="hero">
            
        </div>
    </div>
  )
}

export default StoryEditor