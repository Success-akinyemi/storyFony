import { useEffect, useState } from 'react';
import './StoryCover.css'

function StoryCover({setSelectedCard, image, desc}) {
  return (
    <div className='storyCover'>
        <p>Story cover</p>
        <div className="imgCard">
            <img className='cardImg' src={image} alt="" />
        </div>
        <div className="options">
            <div className="left" onClick={() => setSelectedCard('uploadProfile')}>Import cover</div>
            <div className="right">Regenerate AI cover</div>
        </div>
    </div>
  )
}

export default StoryCover