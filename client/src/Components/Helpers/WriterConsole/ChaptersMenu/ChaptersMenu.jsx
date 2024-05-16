import { useState } from 'react';
import './ChaptersMenu.css'
import { useDispatch, useSelector } from 'react-redux';
import DotsImg from '../../../../assets/dragDot.png'
import PenImg from '../../../../assets/pen3.png'
import AddImg from '../../../../assets/add.png'

import { useLocation } from 'react-router-dom';
import { updateStoryChapterContent } from '../../../../helpers/api';


function ChaptersMenu({storyChapter, onChapterClick, currentChapterContent, setSelectedCard}) {
    const dispatch = useDispatch()
    const loc = useLocation()
    const storyId = loc.pathname.split('/')[2]
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const userId = user._id
    const [activeChapter, setActiveChapter] = useState(null)
    const [anyEdit, setAnyEdit] = useState('');
    const [ updatingChapter, setUpatingChapter ] = useState(false)


    const handleChapterClick = (chapterContent, chapterNumber, id) => {
        onChapterClick(chapterContent);
        setActiveChapter(chapterNumber);
        setAnyEdit(id)
    };

    const handleUpdateStoryChapter = async (chapterId, story) => {
            try {
                setUpatingChapter(true)

                const res = await updateStoryChapterContent({userId, storyId, chapterId, currentChapterContent: currentChapterContent?.chapterContent})
                if(res?.data.success){
                    //dispatch(signInSuccess(res?.data.user))
                    window.location.reload()
                }
            } catch (error) {
                console.log('ERROR SAVING CHAPTER', error)
            } finally{
                setUpatingChapter(false)
            }
    }

  return (
    <div className='chaptersMenu'>
        <div className='t-card'>
            {
                storyChapter.map((item) => (
                    <div className={`t-cardList ${activeChapter === item.chapterNumber ? 'active' : ''}`} key={item?._id} onClick={() => handleChapterClick(item, item?.chapterNumber, item?._id)}>
                        <div className="contentLeft">
                            <img src={DotsImg} />
                        </div>

                        <div className="contentRight">
                            <h3>{item?.chapterNumber}</h3>
                            <span>
                            { currentChapterContent?._id !== item._id && (
                                <>
                                    <p>{item?.chapterTitle}</p>
                                    <img src={PenImg} />
                                </>
                            )}
                                { currentChapterContent?._id === item._id && (
                                    <div className='saveEdit'>
                                        <p>{item?.chapterTitle}</p>
                                        <div className='btnBox'>
                                            <button disabled={updatingChapter} className='saveBtn' onClick={() => handleUpdateStoryChapter(item?._id, item?.chapterContent)}>{updatingChapter ? 'Saving...' : 'Done'}</button>
                                        </div>
                                    </div>
                                )}
                            </span>
                        </div>
                    </div>
                ))
            }
        </div>

        <div className="newCapter" onClick={() => setSelectedCard('AddNewChapter')}>
            <img src={AddImg} />
            <p>Add new chapter</p>
        </div>
    </div>
  )
}

export default ChaptersMenu