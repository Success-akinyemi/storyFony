import { useLocation } from 'react-router-dom'
import './AiVoiceReader.css'
import { useSelector } from 'react-redux'
import { voice, voicePitch, voiceSpeed } from '../../../data/aiVoice'
import PlayImg from '../../../assets/play.png'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { useState } from 'react'
import { generateTranscipt } from '../../../helpers/api'
import toast from 'react-hot-toast'

function AiVoiceReader() {
  const location = useLocation()
  const path = location.pathname.split('/')[3]
  const  {currentUser}  = useSelector(state => state.user)
  const user = currentUser?.data
  const [ userVoice, setUserVoice ] = useState()
  const [ isLoading, setIsloading ] = useState(false)

  const generateAudio = async () => {
    const userId = user?._id
    const storyId = path
    
    try {
      setIsloading(true)
      if(!userVoice){
        toast.error('Select a user Voice')
        return;
      }
      if(isLoading){
        toast.error('Generating Please wait')
        return
      }
      const res = await generateTranscipt({userId, storyId, userVoice})
    } catch (error) {
      console.log('ERROR GENERATING AUDIO', error)
    } finally{
      setIsloading(false)
    }
  }

  return (
    <div className='aiVoiceReader' >
      <div className="voice">
        <p>User voice</p>
        <select value={userVoice} onChange={(e) => setUserVoice(e.target.value)}>
          {
           voice.map((item, idx) => (
             <option value={item.value} key={idx} >{item.name}</option>
           )) 
          }
        </select>
      </div>

      <div className="controls">
        <div className="leftSide">
          <p>Speed</p>
          <select>
            {
              voiceSpeed.map((item, idx) => (
                <option value={item.value} key={idx} >{item.name}</option>
              ))
            }
          </select>
        </div>
        <div className="rightSide">
          <p>Voice pitch</p>
          <select>
            {
              voicePitch.map((item, idx) => (
                <option value={item.value} key={idx} >{item.name}</option>
              ))
            }
          </select>
        </div>
      </div>

      <div className='bottom' >
        <div className="play" onClick={generateAudio}>
          <img src={PlayImg} alt='play button' />
        </div>

        <div className="pause" style={{color: 'white'}}>
            {isLoading && 'generating...'}
        </div>
      </div>
    </div>
  )
}

export default AiVoiceReader