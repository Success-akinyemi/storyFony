import { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/fetch.hooks'
import './UserDashboard.css'
import { Avatar } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import MyStoryBooks from '../../Components/MyStoryBooks/MyStoryBooks';
import MyBookMarked from '../../Components/MyBookMarked/MyBookMarked';
import LikedStories from '../../Components/LikedStories/LikedStories';
import UploadProfilePhoto from '../../Components/UploadProfilePhoto/UploadProfilePhoto';
import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar';
import { useSelector } from 'react-redux';
import ShareOnSocialMedia from '../../Components/Helpers/ShareOnSocialMedia/ShareOnSocialMedia';

function UserDashboard() {
  const  {currentUser}  = useSelector(state => state.user)
  const user = currentUser?.data
  const [selectedCard, setSelectedCard] = useState(null)
  const [ select, setSelect ] = useState('myStoryBook')
  const [shareStoryId, setShareStoryId] = useState('')


  const renderPopupComponent = () => {
    switch(selectedCard) {
      case 'uploadProfile' :
        return (
            <UploadProfilePhoto />
        );
      case 'shareStoryToSocialMedia':
        return(
          <ShareOnSocialMedia shareStoryId={shareStoryId} />
        );
    }
  }

    //Close popup when overlay is clicked
    /**
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
     * 
     */

  const closePopup = () => {
    setSelectedCard(null);
  };

  //if(isLoading) return <h1>Loading...</h1>
  //if(serverError) return <h1>{serverError?.message}</h1>
  return (
    <div className='userDashboard'>
      {selectedCard && (
        <>
          <div className='popup-overlay'></div>
          <div className={`popup active`}>
              <span className='popup-close' onClick={closePopup}>
                X
              </span>
            <div className='popup-content'>
                {renderPopupComponent()}
            </div>
          </div>
        </>
      )}
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className="userDashboardHero">
          <div className="content">
              <div className="top">
                <div className="image">
                  <div className="img">
                    {
                      user?.profileImg ? (
                        <img src={user?.profileImg} alt='profile' className='profileImg' />
                      ) : (
                        <Avatar className='avatar' />
                      )
                    }
                  </div>
                </div>

                <div className="name">
                  <h2 className="userName">{user?.name}</h2>
                  <p className='penName'>@{user?.penName}</p>
                </div>
              </div>
              
              <div className="bottom">
                <span className={`${select === 'myStoryBook' ? 'select' : ''}`} onClick={() => setSelect('myStoryBook')}>My story books</span>
                <span className={`${select === 'myBookmarked' ? 'select' : ''}`} onClick={() => setSelect('myBookmarked')}>My bookmarked</span>
                <span className={`${select === 'likeStories' ? 'select' : ''}`} onClick={() => setSelect('likeStories')}>Liked stories</span>
              </div>
          </div>
        </div>

        { select === 'myStoryBook' && (
          <MyStoryBooks  setSelectedCard={setSelectedCard} setShareStoryId={setShareStoryId} />
        )}

        { select === 'myBookmarked' && (
          <MyBookMarked />
        )}

        { select === 'likeStories' && (
          <LikedStories />
        )}
    </div>
  )
}

export default UserDashboard