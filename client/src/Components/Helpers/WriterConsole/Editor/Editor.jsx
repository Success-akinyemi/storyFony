import { useLocation } from 'react-router-dom'
import './Editor.css'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { continueWritingStory, repharseWords } from '../../../../helpers/api'
import { useState } from 'react'

function Editor({currentChapterContent, selectedWords, setSelectedWords, continueWriting, setContinueWriting, appendMoreStoryContent, repharsedWords, setRepharsedWords, replaceSelectedWords  }) {
    //const dispatch = useDispatch()
    const loc = useLocation()
    const storyId = loc.pathname.split('/')[2]
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const userId = user._id
    const [ isWriting, setIsWriting ] = useState(false)
    const [ isRepharsing, setIsRepharsing ] = useState(false)


    const handleContinueWriting = async (chapterId) => {
        if(!chapterId){
            toast.error('Please Select a Chapter in Chapter tab')
            return;
        }

        try {
            setIsWriting(true)
            const res = await continueWritingStory({userId, storyId, chapterId})
            if(res?.success){
                setContinueWriting(res?.data)
            }
        } catch (error) {
            console.log('Unable to continue writing chapter',error)
        } finally {
            setIsWriting(false)
        }

    }

    const handleMoreStoryClick = (content) => {
        appendMoreStoryContent(content);
      };
    
    const handleRephraseWords = async (words, type) => {
        if(!currentChapterContent?._id){
            toast.error('Please Select a Chapter in Chapter tab')
            return;
        }
        try {
            setIsRepharsing(true)
            const res = await repharseWords({words, type})
            if(res?.success){
                setRepharsedWords(res?.data)
            }
        } catch (error) {
            console.log('UNABLE TO GET REPHARSE WORD', error)
        } finally {
            setIsRepharsing(false)
        }
    }
    return (
    <div className='writerConsoleEditor'>
        <div className="btns">
            <button className="btn" disabled={isWriting} onClick={() => handleContinueWriting(currentChapterContent?._id)} >{isWriting ? 'Writing...' : `Contine writing ${currentChapterContent?.chapterNumber ? currentChapterContent?.chapterNumber : ''}`}</button>
            {selectedWords.length > 0 && (<button disabled={isRepharsing} onClick={() => handleRephraseWords(selectedWords.join(' '), 'Longer')} className='btn'>{isRepharsing ? 'Repharsing' : 'Rephrase words (Long)'}</button>)}
            {selectedWords.length > 0 && (<button disabled={isRepharsing} onClick={() => handleRephraseWords(selectedWords.join(' '), 'Shorter')} className='btn'>{isRepharsing ? 'Repharsing' : 'Rephrase words (Short)'}</button>)}
        </div>
        {
            continueWriting?.length > 0 && (
                <>
                    <p className='chooseMoreStory'>Choose from this to continue your story</p>
                    {
                        continueWriting.map((item) => (
                            <div key={item?._id} className="moreStory" onClick={() => handleMoreStoryClick(item?.content)} >
                                <div className="fullStory">{item?.content}</div>
                                {item?.content.substring(0, 200)}...
                            </div>
                        ))
                    }
                </>
            )
        }
        {
            selectedWords.length > 0 && (
                <div className='selectedWordsGroup'>
                    <button className='clearBtn' onClick={() => setSelectedWords([])} >clear</button>
                    <p>{selectedWords.join(' ')}</p>
                </div>
            )
        }
        {
            repharsedWords?.length > 0 && selectedWords.length > 0 && (
                <>
                    <p className='chooseMoreStory'>Choose from this to Replace your story</p>
                    {
                        repharsedWords.map((item) => (
                            <div key={item?._id} className="moreStory" onClick={() => replaceSelectedWords(item?.content)} >
                                <div className="fullStory">{item?.content}</div>
                                {item?.content.substring(0, 200)}...
                            </div>
                        ))
                    }
                </>
            )
        }
    </div>
  )
}

export default Editor