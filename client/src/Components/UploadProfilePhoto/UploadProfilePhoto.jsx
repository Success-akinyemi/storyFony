import { Avatar } from '@mui/material'
import { useFetch } from '../../hooks/fetch.hooks'
import './UploadProfilePhoto.css'
import { useState } from 'react'

function UploadProfilePhoto() {
  const { apiData } = useFetch()
  const [ selectedImage, setSelectedImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='uploadProfilePhoto'>
        <h2>Upload profile picture</h2>

        <div className="body">
          <div className="left">
            <div className="image">
              {
                selectedImage ? (
                  <img src={selectedImage} alt='profile' />
                ) :
                apiData?.profileImg ? (
                  <img src={apiData?.profileImg} alt='profile' />
                ) : (
                  <Avatar className='avatar' />
                )
              }
            </div>
          </div>

          <div className="right">
            <label>
              Change
              <input onChange={handleImageChange} type='file' hidden id='image-upload' accept='image/jpeg image/png'/>
            </label>
          </div>
        </div>

        <div className="btn">
          Upload
        </div>
    </div>
  )
}

export default UploadProfilePhoto