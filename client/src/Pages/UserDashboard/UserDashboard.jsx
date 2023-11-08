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

function UserDashboard() {
  const [selectedCard, setSelectedCard] = useState(null)
  const [ select, setSelect ] = useState('myStoryBook')

  const { apiData, isLoading, serverError } = useFetch()

  const renderPopupComponent = () => {
    switch(selectedCard) {
      case 'uploadProfile' :
        return (
            <UploadProfilePhoto />
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

  //if(isLoading) return <h1>Loading...</h1>
  //if(serverError) return <h1>{serverError?.message}</h1>
  return (
    <div className='userDashboard'>
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
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className="userDashboardHero">
          <div className="content">
              <div className="top">
                <div className="image">
                  <div className="img" onClick={() => setSelectedCard('uploadProfile')}>
                    <AddIcon className='addIcon' />
                    {
                      apiData?.profileImg ? (
                        <img src={apiData?.profileImg} alt='profile' />
                      ) : (
                        <Avatar className='avatar' />
                      )
                    }
                  </div>
                </div>

                <div className="name">
                  <h2 className="userName">{apiData?.fisrtName} {apiData?.lastName}</h2>
                  <p className='penName'>@{apiData?.penName}</p>
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
          <MyStoryBooks />
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