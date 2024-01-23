import './BookSummary.css'
import PenImg from '../../../assets/pen2.png'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createNewStory, generateNewStoryDesc, saveStoryDesc } from '../../../helpers/api'

function BookSummary({motive}) {
  const loc = useLocation()
  const storyId = loc.pathname.split('/')[3]
  const userId = loc.pathname.split('/')[2]
  const [ motiveText, setMotiveText ] = useState('')
  const [ loadingState, setLoadingState ] = useState(false)

  useEffect(() => {
    setMotiveText(motive)
  }, [motive])

  const newDesc = async (desc) => {
    try {
      setLoadingState(true)
      const res = await generateNewStoryDesc({desc, storyId, userId})
      //console.log(desc, storyId, userId)
      if(res?.data.success){

      }
    } catch (error) {
      console.log('Error creating new description', error)      
    } finally {
      setLoadingState(false)
    }
  }

  const saveDesc = async (desc) => {
    try {
      setLoadingState(true)
      const res = await saveStoryDesc({desc, storyId, userId})
      if(res?.data.success){

      }
    } catch (error) {
      console.log('Error saving new description', error)      
    } finally {
      setLoadingState(false)
    }
  }

  const newStory = async () => {
    try {
      setLoadingState(true)
      const res = await createNewStory({storyId, userId})
    } catch (error) {
      console.log('Error saving new description', error)      
    } finally {
      setLoadingState(false)
    }
  }

  return (
    <div className='bookSummary'>
        <p className="text">You can edit your story line</p>
        <div className="inputfield">
            <textarea defaultValue={motive} value={motiveText} onChange={(e) => setMotiveText(e.target.value)}></textarea>
            <button disabled={!motiveText || loadingState} onClick={() => newDesc(motiveText)} className="motive">{loadingState ? 'Generating...' : 'Generate new story line AI'}</button>
            {
              motive !== motiveText && (
                <button className='newDesc' disabled={!motiveText || loadingState} onClick={() => saveDesc(motiveText)}>Save Story</button>
              )
            }
        </div>
        <button disabled={loadingState} className="rewrite" onClick={newStory}>
            {loadingState ? ('Rewriting') :
             (
              <>
                Rewrite the whole story
                <img src={PenImg} className="pen" />
              </>
             )
             }
        </button>
    </div>
  )
}

export default BookSummary