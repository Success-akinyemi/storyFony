import { useEffect, useRef, useState } from 'react'
import './UploadStoryCover.css'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { app } from "../../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import ProgressBar from '../ProgressBar/ProgressBar';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadCoverImg } from '../../../helpers/api';

function UploadStoryCover() {
  const loc = useLocation()
  const storyId = loc.pathname.split('/')[3]
  const userId = loc.pathname.split('/')[2]
  const [ image, setImage ] = useState(null)
  const [fileName, setFileName ] = useState('No File Selected');
  const [error, setError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploadingImg, setUploadingImg] = useState(false)

  useEffect(() => {
    setFormData({...formData, storyId, userId})
  }, [storyId, userId])


  const onDrop = useCallback( async (acceptedFiles, rejectedFiles) => {
    if(rejectedFiles.length > 0){
      const rejectedFile = rejectedFiles[0];
      if(rejectedFile.type && !rejectedFile.type.startsWith('image/')){
        setError('Invalid file type. Please upload an image.');
        //console.log('error',error)
      } else if(rejectedFile.size > 3 * 1024 * 1024){
        setError('File size exceeds the limit of 3MB. Please upload a smaller image.');
      }
      setTimeout(() => setError(null), 4000);
      return;
      }
    
    const selectedFile = acceptedFiles[0];

    if(!selectedFile) return;

    setImage(selectedFile)
    setFileName(selectedFile.name)
  }, [])

  useEffect(() => {
    if(image){
      handleFileUpload(image)
    }
  }, [image]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    maxSize: 3 * 1024 * 1024,
  })

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        const progress =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setImageUploadProgress(Math.round(progress));
      },
      (error) => {
        //console.log('ERROR', error)
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, coverImg: downloadURL })
        );
      }
    );
  };

  const handleCoverImg = async () => {
    if(!formData.coverImg){
      toast.error('select an image')
      return;
    }

    try {
      setUploadingImg(true)
      const res = await uploadCoverImg(formData)
    } catch (error) {
      
    } finally {
      setUploadingImg(false)
      setImage(null)
    }
  }
  return (
    <div className='uploadStoryCover'>
        <p className='title'>Import story book cover</p>
        <form className="imageUploader">
          <div {...getRootProps()} className='inputCard'>
            <input {...getInputProps()} className='imgInput'/>
            {
              isDragActive ?
                <p className='t-1'>Drop the files here ...</p> :
                <p className='info'>
                  <p className='t-1'>Drag or drop the file here or browse</p>
                  <small className='t-2'>1000 X 625 image size is recommended</small>
                </p>
            }
          </div>
        </form>

        <div className="content">
          {
            error ? (
              <p className='fileError'>{error}</p>
            ) : (
              <p className='fileName'>{fileName}</p>
            )
          }

          <div className="statusbar">
            <ProgressBar
              percent={imageUploadProgress}
            />
          </div>

          <p className="uploadingStats">
            {imageError ? (
              <span className="textRed">
                Error Uploading Image (file size must be less than 2 MB)
              </span>
            ) : imageUploadProgress > 0 && imageUploadProgress < 100 ? (
              <span className="textGray">{`Uploading: ${imageUploadProgress}% complete`}</span>
            ) : imageUploadProgress === 100 ? (
              <span className="textGreen">Image uploaded successfully</span>
            ) : (
              ""
            )}
          </p>
        </div>

        <div className="btn">
          <button className='button' onClick={handleCoverImg} disabled={!formData.coverImg || uploadingImg}>
            {
              uploadingImg ? (
                'uploading'
              ) : (
                <>
                  {!formData.coverImg ? 'Select an Image' : 'Upload cover' }
                </>
              )
            }
          </button>
        </div>
    </div>
  )
}

export default UploadStoryCover