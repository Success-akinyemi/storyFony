import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import './WriterConsole.css';
import Beaker2Img from '../../assets/beaker2.png';
import BackIconImg from '../../assets/backIcon.png';
import Logo from '../../Components/Logo/Logo';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ProgressBar from '../../Components/Helpers/ProgressBar/ProgressBar';
import { userStoryBook } from '../../hooks/fetch.hooks';
import ChaptersMenu from '../../Components/Helpers/WriterConsole/ChaptersMenu/ChaptersMenu';
import AddNewChapter from '../../Components/Helpers/AddNewChapter/AddNewChapter';
import WriterEditor from '../../Components/Helpers/WriterConsole/WriterEditor/WriterEditor';
import Editor from '../../Components/Helpers/WriterConsole/Editor/Editor';
import toast from 'react-hot-toast';

const WriterConsole = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const location = useLocation();
    const storyId = location.pathname.split('/')[2];
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser?.data;
    const userId = user._id;
    const [activeMenu, setActiveMenu] = useState(menus[0].text);
    const [selectedChapterContent, setSelectedChapterContent] = useState('');
    const [currentChapterContent, setCurrentChapterContent] = useState({chapterContent: ''});
    const [selectedWords, setSelectedWords] = useState([]);
    const [continueWriting, setContinueWriting] = useState([]);
    const [repharsedWords, setRepharsedWords] = useState([]);


    const appendMoreStoryContent = (moreStoryContent) => {
        setSelectedChapterContent(prevContent => ({
            ...prevContent,
            chapterContent: prevContent.chapterContent + moreStoryContent
        }));
    };

    const replaceSelectedWords = (newContent) => {
        if (!editor) return;
        const currentContent = editor.getHTML();
        const oldText = selectedWords.join(' ');
        const updatedContent = currentContent.replace(new RegExp(oldText, 'g'), newContent);
        editor.commands.setContent(updatedContent);
        toast.success('Content replaced successfully');
    };
    

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

    const renderPopupComponent = () => {
        switch (selectedCard) {
            case 'AddNewChapter':
                return (
                    <AddNewChapter propsUser={userId} propsStory={storyId} />
                );
            default:
                return null;
        }
    };

    const [query, setQuery] = useState({});

    useEffect(() => {
        setQuery({ userId, storyId });
    }, [userId, storyId]);

    const { isLoadingStory, apiUserStoryData } = userStoryBook(query);
    const data = apiUserStoryData?.data;

    const text = currentChapterContent?.chapterContent || apiUserStoryData?.data.story[0]?.chapterContent;
    const words = text?.split(/\s+/).filter(word => word.trim().length > 0).length;

    const storyData = apiUserStoryData?.data.story[0]?.chapterContent;

    const creditPercentage = (user?.totalCreditUsed * 100) / user?.totalCredit;
    const percentageValue = Math.floor(creditPercentage);

    const renderContentComponent = () => {
        switch (activeMenu) {
            case 'Chapter':
                return <ChaptersMenu storyChapter={apiUserStoryData?.data.story} onChapterClick={handleChapterClick} currentChapterContent={currentChapterContent} setSelectedCard={setSelectedCard} />;
            case 'Editor':
                return <Editor currentChapterContent={currentChapterContent} selectedWords={selectedWords} setSelectedWords={setSelectedWords} setContinueWriting={setContinueWriting} continueWriting={continueWriting} appendMoreStoryContent={appendMoreStoryContent} repharsedWords={repharsedWords} setRepharsedWords={setRepharsedWords} replaceSelectedWords={replaceSelectedWords} />;
            default:
                return null;
        }
    };

    const handleChapterClick = (chapterContent) => {
        setSelectedChapterContent(chapterContent);
        setCurrentChapterContent(chapterContent);
    };

    const handleEditorChange = (content) => {
        setCurrentChapterContent(prevContent => ({
            ...prevContent,
            chapterContent: content
        }));
    };

    return (
        <div className='writerConsole'>
            {selectedCard && (
                <>
                    <div className='popup-overlay'></div>
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
                        story word count | {words}
                    </div>
                    <div className="right">
                        <div className="top">
                            <div className="up">
                                <img src={Beaker2Img} className='beakerImg' />
                                <span>{user?.totalCreditUsed} / </span>{user?.totalCredit} <small>Fony ink used</small>
                            </div>
                            <div className="down">
                                <ProgressBar percent={percentageValue} />
                            </div>
                        </div>
                        <div className="middle">
                            <span className="action">Action <KeyboardArrowDownIcon className='keyIcon' /></span>
                            <div className="actionMenu">
                                <div className='menus'>Save to my stories</div>
                            </div>
                        </div>
                        <div className="bottom">
                            <Link className='link' to='/profile-page'>
                                <img src={user?.profileImg} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="body">
                <div className="chapterOption">
                    <p>Current Chapter: {' '}</p> {currentChapterContent ? currentChapterContent?.chapterNumber : ' Select a chapter to work with'}
                </div>
                <div className="bodyContainer">
                    <div className='editor'>
                        <WriterEditor content={selectedChapterContent ? selectedChapterContent : ''} defaultContent={storyData} onEditorChange={handleEditorChange} setSelectedWords={setSelectedWords} selectedWords={selectedWords} appendMoreStoryContent={appendMoreStoryContent} replaceSelectedWords={replaceSelectedWords} />
                    </div>
                    <div className='sidebar'>
                        storyID: {storyId}
                        <div className='menus'>
                            {menus.map((item, idx) => (
                                <div key={idx} className={`cardMenu ${activeMenu === item?.text ? 'active' : ''}`} onClick={() => setActiveMenu(item?.text)}>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                        <div className="bodyArea">
                            {renderContentComponent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WriterConsole;

const menus = [
    { text: 'Editor' },
    { text: 'Chapter' },
];
