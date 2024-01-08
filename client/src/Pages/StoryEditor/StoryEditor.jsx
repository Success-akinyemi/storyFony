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
import { Link } from 'react-router-dom';
import Beaker2Img from '../../assets/beaker2.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StoryCover from '../../Components/Helpers/StoryCover/StoryCover';

function StoryEditor() {
  const [selectedCard, setSelectedCard] = useState(null)
  const  {currentUser}  = useSelector(state => state.user)
  const user = currentUser?.data
  const [ menuActive, setMenuActive ] = useState(1)
  const [ menuTitle, setMenuTitle ] = useState('Book summary')
  const [ menuImg, setMenuImg ] = useState()

  //POPUP
  const renderPopupComponent = () => {
    switch(selectedCard) {
      case 'uploadProfile' :
        return (
            <p>Hello</p>
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

  const renderContentComponet = () => {
    switch(menuActive) {
      case 1:
        return <BookSummary />
      case 2: 
        return <TableOfContent />
      case 3:
        return <AiVoiceReader />
        case 4:
          return <StoryCover setSelectedCard={setSelectedCard} />
      default: 
        return null
    }
  }
  
  return (
    <div className='storyEditor'>
      {selectedCard && (
            <>
            <div className='popup-overlay' onClick={closePopup}></div>
            <div className={`popup active`}>
                <span className='popup-close' onClick={closePopup}>
                    Close
                </span>
                <div className='popup-content'>
                    {renderPopupComponent()}
                </div>
            </div>
            </>
      )}
        <div className="hero">
            <div className="nav">
              <div className="left">
                <Link>
                  <img src={BackIconImg} alt="" className='backIcon' />
                </Link>
                <Logo />
              </div>

              <div className="middle">
                Total story word | 2670
              </div>

              <div className="right">
                <div className="top">
                  <div className="up">
                    <img src={Beaker2Img} className='beakerImg' />
                    <span>316 / </span>4000 <small>Fony ink used</small>
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
                  {renderContentComponet()}
                </div>
              </div>
            </div>
          </div>

          <div className="right"></div>
        </div>
    </div>
  )
}

export default StoryEditor