import { useState } from 'react'
import './AddNewChapter.css'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { addNewChapters } from '../../../helpers/api'
import { signInSuccess } from '../../../redux/user/userslice'
import { useDispatch } from 'react-redux'

function AddNewChapter({propsUser, propsStory}) {
    const dispatch = useDispatch()
    const loc = useLocation()
    const storyId = propsStory ? propsStory : loc.pathname.split('/')[3]
    const userId = propsUser ? propsUser : loc.pathname.split('/')[2]
    const [newChapter, setNewChapter] = useState(1)
    const [chapterImg, setChapterImg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleImage = (option) => {
        setChapterImg(option)
    }

    const handleChapterChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10));
        setNewChapter(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!newChapter || newChapter < 1){
            toast.error('Please enter a valid chapter number.')
            return;
        }

        try {
            setIsLoading(true)
            
            const res = await addNewChapters({storyId, userId, newChapter, chapterImg})
            if(res?.data.success){
                dispatch(signInSuccess(res?.data.user))
                window.location.reload()
              }
        } catch (error) {
            
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className='addNewChapter' >
        <form className='newChapterForm' onSubmit={handleSubmit} >
            <p className='title'>Add New Chapter</p>
            <div className="inputs">
                <label>How many chapter would you like to add?</label>
                <input required type="number" className='input' value={newChapter} onChange={handleChapterChange} />
                <small>Fony Ink required: <span className='ink'>{Number.isNaN(newChapter) ? null : newChapter * 40}</span></small>
            </div>
            {
                /**
                 * 
            <div className="inputs">
                <label>Generate AI Image for each chapter?</label>
                <div className="options">
                    <div className={`option ${chapterImg === false ? 'active' : '' }`} onClick={() => handleImage(false)}>NO</div>
                    <div className={`option ${chapterImg === true ? 'active' : '' }`} onClick={() => handleImage(true)}>YES</div>
                </div>
            </div>
                 */
            }

            <div className="btn">
                <button disabled={isLoading} className="button">{ isLoading ? 'Generating Chapters' : 'Create New Chapters' }</button>
            </div>
        </form>
    </div>
  )
}

export default AddNewChapter