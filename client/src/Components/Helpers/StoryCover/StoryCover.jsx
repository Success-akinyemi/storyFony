import { useEffect, useState } from 'react';
import './StoryCover.css'
import { generateCoverStoryImage } from '../../../helpers/api';
import { useLocation } from 'react-router-dom';

function StoryCover({setSelectedCard, image, desc}) {
  const loc = useLocation()
  const storyId = loc.pathname.split('/')[3]
  const userId = loc.pathname.split('/')[2]
  const [ generatingImage, setGeneratingImage ] = useState(false)
  
  const handleGeneratingImage = async () => {
    const comfirmation = window.confirm('New Story Image cost 5 fony ink. Proceed?')
    if(comfirmation){
      try {
        setGeneratingImage(true)
  
        const res = await generateCoverStoryImage({desc, storyId, userId})
      } catch (error) {
        
      } finally {
        setGeneratingImage(false)
      }
    }
  }

  return (
    <div className='storyCover'>
        <p>Story cover</p>
        <div className="imgCard">
            <img className='cardImg' src={image} alt="" />
        </div>
        <div className="options">
            <div className="left" onClick={() => setSelectedCard('uploadProfile')}>Import cover</div>
            <div className="right" onClick={handleGeneratingImage}>{generatingImage ? 'Regenerating AI cover...' : 'Regenerate AI cover'}</div>
        </div>
    </div>
  )
}

export default StoryCover