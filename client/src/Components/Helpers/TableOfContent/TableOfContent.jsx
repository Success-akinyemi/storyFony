import './TableOfContent.css'
import PenImg from '../../../assets/pen3.png'
import DotsImg from '../../../assets/dragDot.png'
import AddImg from '../../../assets/add.png'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { updateStoryChapterContent } from '../../../helpers/api'
import toast from 'react-hot-toast'
import { signInSuccess } from '../../../redux/user/userslice'
import { useDispatch } from 'react-redux'

function TableOfContent({storyChapter, onChapterClick, currentChapterContent, defaultContent, setSelectedCard}) {
    const dispatch = useDispatch()
    const loc = useLocation()
    const storyId = loc.pathname.split('/')[3]
    const userId = loc.pathname.split('/')[2]
    const [activeChapter, setActiveChapter] = useState(null)
    const [anyEdit, setAnyEdit] = useState('');
    const [ updatingChapter, setUpatingChapter ] = useState(false)

    const handleChapterClick = (chapterContent, chapterNumber, id) => {
        onChapterClick(chapterContent);
        setActiveChapter(chapterNumber);
        setAnyEdit(id)
    };
      
    const handleUpdateStoryChapter = async (chapterId, story) => {

        if(story === currentChapterContent.chapterContent){
            toast.error('Now changes made')
            return;
        } else{

            try {
                setUpatingChapter(true)
                const res = await updateStoryChapterContent({userId, storyId, chapterId, currentChapterContent})
                if(res?.data.success){
                    dispatch(signInSuccess(res?.data.user))
                }
            } catch (error) {
                console.log('ERROR SAVING CHAPTER', error)
            } finally{
                setUpatingChapter(false)
            }
        }
    }
    /** 
    useEffect(() => {
        const newEdit =
          currentChapterContent?.content &&
          currentChapterContent.content[0]?.content &&
          currentChapterContent.content[0].content[0]?.text ||
          '';
    
        setAnyEdit(newEdit);
        console.log('eeee', newEdit);
      }, [currentChapterContent]);
    */
    return (
    <div className='tableOfContent'>
        <div className='t-card'>
            {
                storyChapter.map((item) => (
                    <div className={`t-cardList ${activeChapter === item.chapterNumber ? 'active' : ''}`} key={item._id} onClick={() => handleChapterClick(item, item?.chapterNumber, item?._id)}>
                        <div className="contentLeft">
                            <img src={DotsImg} />
                        </div>

                        <div className="contentRight">
                            <h3>{item?.chapterNumber}</h3>
                            <span>
                            { anyEdit !== item._id && (
                                <>
                                    <p>{item?.chapterTitle}</p>
                                    <img src={PenImg} />
                                </>
                            )}
                                { anyEdit === item._id && (
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

export default TableOfContent