import './BookSummary.css'
import PenImg from '../../../assets/pen2.png'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { generateNewStoryDesc } from '../../../helpers/api'

function BookSummary({motive}) {
  const loc = useLocation()
  const storyId = loc.pathname.split('/')[3]
  const userId = loc.pathname.split('/')[2]
  const [ motiveText, setMotiveText ] = useState('')
  const [ loadingState, setLoadingState ] = useState(false)

  useEffect(() => {
    setMotiveText(motive)
  }, [motive])
  console.log('first>>', storyId, userId)

  const newDesc = async (desc) => {
    try {
      setLoadingState(true)
      const res = await generateNewStoryDesc({desc, storyId, userId})
      if(res.data.success){

      }
    } catch (error) {
      console.log('Error cretating new description', error)      
    } finally {
      setLoadingState(false)
    }
  }

  const newStory = async () => {

  }

  return (
    <div className='bookSummary'>
        <p className="text">You can edit your story line</p>
        <div className="inputfield">
            <textarea defaultValue={motive} value={motiveText} onChange={(e) => setMotiveText(e.target.value)}></textarea>
            <button disabled={!motiveText} onClick={() => newDesc(motiveText)} className="motive">{loadingState ? 'Generating...' : 'Generate new story line'}</button>
        </div>
        <button className="rewrite">
            Rewrite the whole story
            <img src={PenImg} className="pen" />
        </button>
    </div>
  )
}

export default BookSummary