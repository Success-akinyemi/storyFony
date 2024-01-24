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
            <div className='imporCoverPage'>
              <p className='title'>Import story book cover</p>
              <div className="up"></div>
              <div className="bar"></div>
              <div className="uploadBtn"></div>
            </div>
        );
      case 'funding':
        return(
          <div>Funding</div>
        );
    }
  }

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
        return <TableOfContent storyChapter={data?.story} onChapterClick={handleChapterClick} />
      case 3:
        return <AiVoiceReader />
        case 4:
          return <StoryCover image={data?.storyImage} desc={data?.storyDesc} setSelectedCard={setSelectedCard} />
      default: 
        return null
    }
  }

  //Handle story Content display
  const handleChapterClick = (chapterContent) => {
    setSelectedChapterContent(chapterContent)
    console.log('CONTENT', selectedChapterContent)
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
                    <div className='menus'>Publish to community</div>
                    <div className='menus'>Public to private</div>
                    <div className='menus'>Save to draft</div>
                    <div className='menus'>Download the PDF</div>
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
              <TextEditor content={selectedChapterContent ? selectedChapterContent : ''} />
            </div>
          </div>
        </div>
    </div>
  )
}

export default StoryEditor