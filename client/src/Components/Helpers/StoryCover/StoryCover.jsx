import { useEffect, useState } from 'react';
import './StoryCover.css'

function StoryCover({setSelectedCard}) {

  return (
    <div className='storyCover'>
        <p>Story cover</p>
        <div className="imgCard">
            <img src="" alt="" />
        </div>
        <div className="options">
            <div className="left" onClick={() => setSelectedCard('funding')}>Import cover</div>
            <div className="right">Regenerate AI cover</div>
        </div>
    </div>
  )
}

export default StoryCover