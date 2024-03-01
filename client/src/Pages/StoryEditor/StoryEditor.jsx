import { useSelector } from 'react-redux'
import './StoryEditor.css'
import { storyEditorSidebarMenu } from '../../data/storyEditorSidebarMenu'
import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookSummary from '../../Components/Helpers/BookSummary/BookSummary';
import TableOfContent from '../../Components/Helpers/TableOfContent/TableOfContent';
import AiVoiceReader from '../../Components/Helpers/AiVoiceReader/AiVoiceReader';
import Logo from '../../Components/Logo/Logo';
import BackIconImg from '../../assets/backIcon.png'
import { Link, useLocation } from 'react-router-dom';
import Beaker2Img from '../../assets/beaker2.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StoryCover from '../../Components/Helpers/StoryCover/StoryCover';
import { userStoryBookEditor } from '../../hooks/fetch.hooks';
import PenImg from '../../assets/writerPen.png'
import TextEditor from '../../Components/Helpers/TextEditor/TextEditor';
import { formatDistanceToNow } from 'date-fns';
import UploadStoryCover from '../../Components/Helpers/UploadStoryCover/UploadStoryCover';
import AddNewChapter from '../../Components/Helpers/AddNewChapter/AddNewChapter';
import { createStorPdf, handlePrivateStory, handlePublishedToCommunity } from '../../helpers/api';
import toast from 'react-hot-toast';

function StoryEditor() {
  const loc = useLocation()
  const [ query, setQuery ] = useState({})
  const [selectedCard, setSelectedCard] = useState(null)
  const  {currentUser}  = useSelector(state => state.user)
  const user = currentUser?.data
  const [ menuActive, setMenuActive ] = useState(1)
  const [ menuTitle, setMenuTitle ] = useState('Book summary')
  const [ menuImg, setMenuImg ] = useState()
  const [selectedChapterContent, setSelectedChapterContent] = useState('');
  const [currentChapterContent, setCurrentChapterContent] = useState('');
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isLoadingCommunity, setIsLoadingCommunity ] = useState(false)
  const [ isCreatePdf, setIsCreatingPdf ] = useState(false)

  useEffect(() => {
    const userId = loc.pathname.split('/')[2]
    const storyId = loc.pathname.split('/')[3]
    setQuery({ userId, storyId });
  }, []);
  const { isLoadingStory, apiUserStoryData } = userStoryBookEditor(query)
  const data = apiUserStoryData?.data
  console.log('Story editor', data)

  //Date FNS
  const updatedAt = data?.updatedAt;
  const lastUpdatedText = updatedAt ? formatDistanceToNow(new Date(updatedAt)) + ' ago' : '';

  //Total number of words
  const words = data?.story.reduce((totalWords, chapter) => {
    const chapterContent = chapter.chapterContent || '';
    const chapterWords = chapterContent.split(/\s+/).filter(word => word.length > 0);
    return totalWords + chapterWords.length;
  }, 0)


  //POPUP
  const renderPopupComponent = () => {
    switch(selectedCard) {
      case 'uploadProfile' :
        return (
          <UploadStoryCover />
        );
      case 'AddNewChapter':
        return(
          <AddNewChapter />
        );
    }
  }

  //Close popup when overlay is clicked
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('popup-overlay')) {
        setSelectedCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const closePopup = () => {
    setSelectedCard(null);
  };
  //END OF POPUP

  const handleSidebarMenu = (item) => {
    setMenuActive(item.key)
    setMenuTitle(item.text)
    setMenuImg(item.img)
  }

  const onBackClick = () => {
    if(menuActive > 1){
      const newMenuActive = menuActive - 1
      setMenuActive(newMenuActive)
      const selectedItem = storyEditorSidebarMenu.find(item => item.key === newMenuActive);
      if(selectedItem){
        setMenuTitle(selectedItem.text);
        setMenuImg(selectedItem.img)
      }
    }
  }

  const renderContentComponet = (handleChapterClick) => {
    switch(menuActive) {
      case 1:
        return <BookSummary motive={data?.storyDesc} />
      case 2: 
        return <TableOfContent storyChapter={data?.story} onChapterClick={handleChapterClick} currentChapterContent={currentChapterContent} defaultContent={data?.story[0]?.chapterContent} setSelectedCard={setSelectedCard} />
      case 3:
        return <AiVoiceReader />
        case 4:
          return <StoryCover image={data?.coverImage} desc={data?.storyDesc} setSelectedCard={setSelectedCard} />
      default: 
        return null
    }
  }

  //Handle story Content display
  const handleChapterClick = (chapterContent) => {
    setSelectedChapterContent(chapterContent)
    setCurrentChapterContent(chapterContent);
    //console.log('CONTENT', selectedChapterContent)
  }

  const handleEditorChange = (content) => {
    setCurrentChapterContent(content);
  };

  const handleTogglePrivateStory = async (id) => {
    if(isLoading){
      toast.error('Please wait')
      return;
    }
    try {
        setIsLoading(true)
        const userId = user?._id
        const res = await handlePrivateStory({id, userId})
    } catch (error) {
        console.log('ERROR CREATING STORY', error)
    } finally {
        setIsLoading(false)
    }
  }

  const handleToggleToCommunity = async (id) => {
    if(isLoadingCommunity){
      toast.error('Please Wait')
      return;
    }
    try {
        setIsLoadingCommunity(true)
        const userId = user?._id
        const res = await handlePublishedToCommunity({id, userId})
    } catch (error) {
        console.log('ERROR CREATING STORY', error)
    } finally {
      setIsLoadingCommunity(false)
    }
  }

  const handleCreatePdf = async (id) => {
    if(isCreatePdf){
      toast.error('Creating Pdf, please wait')
      return;
    }
    try {
      setIsCreatingPdf(true)
      const userId = user?._id
      const res = await createStorPdf({id, userId})
    } catch (error) {
      console.log('UNABLE TO CREATE PDF',error)
    } finally {
      setIsCreatingPdf(false)
    }
  }
  
  return (
    <div className='storyEditor'>
      {selectedCard && (
            <>
            <div className='popup-overlay' ></div>
                <span className='popup-close' onClick={closePopup}>
                    X
                </span>
            <div className={`popup active`}>
                <div className='popup-content'>
                    {renderPopupComponent()}
                </div>
            </div>
            </>
      )}
        <div className="hero">
            <div className="nav">
              <div className="left">
                <Link to={'/dashboard'}>
                  <img src={BackIconImg} alt="" className='backIcon' />
                </Link>
                <Logo />
              </div>

              <div className="middle">
                Total story word | {words}
              </div>

              <div className="right">
                <div className="top">
                  <div className="up">
                    <img src={Beaker2Img} className='beakerImg' />
                    <span>{user?.totalCreditUsed} / </span>{user?.totalCredit} <small>Fony ink used</small>
                  </div>
                  <div className="down"></div>
                </div>

                <div className="middle">
                  <span className="action">Action <KeyboardArrowDownIcon className='keyIcon' /></span>

                  <div className="actionMenu">
                    <div className='menus' onClick={() => handleToggleToCommunity(data?._id)}>{ isLoadingCommunity ? 'Updating...' : `${data?.PublishedToCommunity ? 'Remove from community' : 'Publish to community'}`}</div>
                    <div className='menus' onClick={() => handleTogglePrivateStory(data?._id)}>{ isLoading ? 'Updating...' : `${data?.privateStory ? 'Private to Public' : 'Public to private'}`}</div>
                    <div className='menus'>Save to draft</div>
                    <div className='menus' onClick={() => handleCreatePdf(data?._id)}>Download the PDF</div>
                  </div>
                </div>

                <div className="bottom">
                  <img src={user?.profileImg} />
                </div>
              </div>
            </div>
        </div>

        <div className="body">
          <div className="left">
            <div className='sidebar'>
              <div className="items">
                {
                  storyEditorSidebarMenu.map((item) => (
                    <div className={`item ${menuActive === item.key ? 'active' : ''}`} key={item.key} onClick={() => handleSidebarMenu(item)}>
                      <img src={menuActive === item.key ? item.imgDark : item.img} alt="" className="icon" />
                      <p>{item.text}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className='content'>
              <div className="contentInfo">
                <div className="top">
                  <span className="backArrow" onClick={onBackClick}>
                    <ArrowBackIcon className='backArrowIcon' />
                  </span>
                  <img src={menuImg} />
                  <p>{menuTitle}</p>

                </div>
                <div className="card">
                  {renderContentComponet(handleChapterClick)}
                </div>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="info">
              <div className="head">
                <h1 className="title">{data?.storyTitle ? data?.storyTitle : data?.userTitle }</h1>
                <img src={PenImg} alt="pen" className="pen" />    
              </div>
              
              <span className='dateInfo'>Last updated: {lastUpdatedText}  ago</span>
            </div>

            <p className="infoText">
              You can edit the story line to suit your imagnination
            </p>

            <div className='content'>
              <TextEditor content={selectedChapterContent ? selectedChapterContent : ''} onEditorChange={handleEditorChange} defaultContent={data?.story[0]?.chapterContent} image={data?.storyImage} />
            </div>
          </div>
        </div>
    </div>
  )
}

export default StoryEditor