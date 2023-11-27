import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
import './CreateStory.css'
import LogoImg from '../../assets/icon.png'
import EditPen from '../../assets/editpen.png'
import { useEffect, useState } from 'react'
import { authors, createStoryPlaceHolder, endingStyle, languages } from '../../data/general'
import { genreData } from '../../data/genreData'
import CheckImg from '../../assets/checkImg.png'
import { useFetch } from '../../hooks/fetch.hooks'
import InsufficientInk from '../../Components/Helpers/InsufficientInk/InsufficientInk'
import { createStory } from '../../helpers/api'
import Spinner from '../../Components/Helpers/Spinner/Spinner'

function CreateStory() {
    const { apiData } = useFetch()
    const [ card, setCard ] = useState(1)
    const [ numberOfWords, setNumberOfWords] = useState(0)
    const [ numberOfLetters, setNumberOfLetters] = useState(0)
    const [ numberOfMotiveWords, setNumberOfMotiveWords] = useState(0)
    const maxWords = 150
    const maxLetters = 150
    const maxMotiveWords = 50

    const [ title, setTitle ] = useState('')
    const [ desc, setDesc ] = useState('')
    const [ motive, setMotive ] = useState('')
    const [ genreValue, setGenreValue ] = useState('')
    const [ ending, setEnding ] = useState('')
    const [ mimicAuthor, setMimicAuthor ] = useState('')
    const [ numberOfSeries, setNumberOfSeries ] = useState('')
    const [ language, setLanguage ] = useState('')

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [ loadingState, setLoadingState ] = useState(false)
    const { placeholder, reason } = createStoryPlaceHolder


    const onBackClick = () => {
        if(card !== 1){
            setCard(card -1)
        }
    }

    const handleWordInputChange = (e) => {
        const words = e.target.value.trim().split(/\s+/).filter((word) => word !== '')
        const wordCount = words.length;

        setNumberOfWords(wordCount);
        setDesc(e.target.value)

        if(wordCount >= maxWords){
            e.target.value = words.slice(0, maxWords).join(' ');
            setNumberOfWords(maxWords);
            e.target.setAttribute('disabled', 'disabled');
        } else {
            e.target.removeAttribute('disabled')
        }
    }

    const handleLetterInputChange = (e) => {
        const inputText = e.target.value;
        const charCount = inputText.length;
    
        setNumberOfLetters(charCount);
        setTitle(inputText);
    
        if (charCount >= maxWords) {
            e.target.value = inputText.slice(0, maxWords);
            setNumberOfLetters(maxWords);
            e.target.setAttribute('disabled', 'disabled');
        } else {
            e.target.removeAttribute('disabled');
        }
    };

    const handleMotiveInputChange = (e) => {
        const words = e.target.value.trim().split(/\s+/).filter((word) => word !== '')
        const wordCount = words.length;

        setNumberOfMotiveWords(wordCount);
        setMotive(e.target.value)

        if(wordCount >= maxMotiveWords){
            e.target.value = words.slice(0, maxMotiveWords).join(' ');
            setNumberOfMotiveWords(maxMotiveWords);
            e.target.setAttribute('disabled', 'disabled');
        } else {
            e.target.removeAttribute('disabled')
        }
    }

    const handleGenre = (genreValue) => {
        setGenreValue(genreValue)
        console.log('Genre', genreValue)
    }

    useEffect(() => {
        const areFieldsEmpty = title === '' || desc === '' || motive === '' || genreValue === '' || ending === '' || numberOfSeries === '' || language === ''
        setIsButtonDisabled(areFieldsEmpty)
    }, [title, desc, motive, genreValue, ending, numberOfSeries, language])
    
    const handleCreateStory = async () => {
        const availabeInk = apiData?.totalCredit
        const costOfSeries = 40

        const totalInkNeeded = numberOfSeries * costOfSeries

        if(totalInkNeeded > availabeInk){
            setErrorMessage('insufficienBalance')
            setShowError(true)
            return;
        }
        try {
            setLoadingState(true)
            const userEmail = apiData?.email
            console.log(title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded)
            const res = await createStory({title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded})
        } catch (error) {
            console.log('ERROR CREATING STORY', error)
        } finally {
            setLoadingState(false)
        }
    }

    const closeError = () => {
        setShowError(false);
        setErrorMessage('');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (event.target.classList.contains('errorOverlay')) {
            closeError();
          }
        };
      
        window.addEventListener('click', handleClickOutside);
      
        return () => {
          window.removeEventListener('click', handleClickOutside);
        };
      }, []);
      

  return (
    <div className='createStory'>
        <AuthUserNavbar enableScrollEffect={true} miniNav={true} onBackClick={onBackClick} />
        {showError && (
            <div className="errorOverlay">
                <div className="errorCard">
                    <span className="closeIcon" onClick={closeError}>
                        &times;
                    </span>
                    <div className='errorContent'>
                        {errorMessage === 'insufficienBalance' ? <InsufficientInk /> : ''}
                    </div>
                </div>
            </div>
        )}

        <div className="conatiner">
            <div className="slide">
                <span className={`indicator ${ card === 1 ? 'active' : ''}`}></span>
                <span className={`indicator ${ card === 2 ? 'active' : ''}`}></span>
                <span className={`indicator ${ card === 3 ? 'active' : ''}`}></span>
                <span className={`indicator ${ card === 4 ? 'active' : ''}`}></span>
            </div>

            <div className="content">

                {
                    card === 1 && (
                        <div className='content1'>
                            <h3><img src={LogoImg} alt='logo'/> Hey Famous Writer, what will you like  to write today</h3>
                            
                            <div className="cards">
                                <p>Select the type of story book you want to write</p>
                                
                                <div className="cardContainer">
                                    <div className="card">
                                        <span>
                                            <img src={EditPen} alt='edit pen icon' className='editPen' />
                                        </span>
                                        
                                        <div className="text">
                                            <h4>Write short story</h4>

                                            <p>Generate a captivating beautiful short story within 2500 words.</p>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <span>
                                            <img src={EditPen} alt='edit pen icon' className='editPen' />
                                        </span>
                                        
                                        <div className="text">
                                            <h4>Write long story</h4>

                                            <p>Develop your very own story with chapter within 8000 words like pro.</p>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <span>
                                            <img src={EditPen} alt='edit pen icon' className='editPen' />
                                        </span>
                                        
                                        <div className="text">
                                            <h4>Write story series</h4>

                                            <p>Imagine been able to create a story series around 20,000 words.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn" onClick={() => setCard(card + 1)}>Proceed</button>
                        </div>
                    )
                }

                {
                    card === 2 && (
                        <div className='content2'>
                            <h3><img src={LogoImg} alt='logo'/> Hey, Famous writer, you’re writing a story series</h3>
                            
                            <div className="cards">
                                <p>Select the story genre you want. You can select upto 3 genres.</p>
                                
                                <div className="cardContainer">
                                    {
                                        genreData.map((item, idx) => (
                                            <div className={`card ${genreValue === item.genre ? 'selectedCard' : ''}`} key={idx} onClick={() => handleGenre(item.genre)}>
                                                <div className={`notSelectedItem ${genreValue === item.genre ? 'selectedItem' : ''}`}>
                                                    <img src={CheckImg} className='checkImg' alt='check'/>
                                                </div>
                                                <img src={item.img} alt={item.genre} />
                                                <span>{item.genre}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <button disabled={!genreValue} className="btn" onClick={() => setCard(card + 1)}>Proceed</button>
                        </div>
                    )
                }

                {
                    card === 3 && (
                        <div className="content3">
                            <h3><img src={LogoImg} alt='logo' className='icon'/> Ok, is time to start writing your story</h3>

                            <div className='storyContent'>
                                <div className='inputGroup1'>
                                    <span className="text">
                                        <p className="text">Give your story a title</p>
                                        <small>{numberOfLetters}/{maxLetters}</small>
                                    </span>
                                    <input type="text" onChange={handleLetterInputChange} value={title} placeholder='Eg, Detective Cane on a Secret mission' />
                                </div>

                                <div className='inputGroup2'>
                                    <span className="text">
                                        <p>Description your story</p>
                                        <small>{numberOfWords}/{maxWords}</small>
                                    </span>
                                    <textarea 
                                        name=""  
                                        cols="30" 
                                        rows="10"
                                        value={desc}
                                        onChange={handleWordInputChange}
                                        placeholder={placeholder}
                                    >
                                        
                                    </textarea>
                                </div>

                                <div className='inputGroup3'>
                                    <div className="left">
                                        <p>Select your story ending style</p>
                                        <select value={ending} onChange={(e) => setEnding(e.target.value)}>
                                            <option value="None">None</option>
                                            {
                                                endingStyle.map((item, idx) => (
                                                    <option value={item.text} key={idx} >{item.text}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="right">
                                        <p>Mimic famous author</p>
                                        <select value={mimicAuthor} onChange={(e) => setMimicAuthor(e.target.value)} >
                                            <option value="none">None</option>
                                            {
                                                authors.map((item, idx) => (
                                                    <option value={item.text} key={idx}>{item.text}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className='inputGroup3'>
                                    <div className="left">
                                        <p>How many series? (40 fony ink per series)</p>
                                        <input type="number" placeholder='Number of series' value={numberOfSeries} onChange={(e) => setNumberOfSeries(e.target.value)}/>
                                    </div>

                                    <div className="right">
                                        <p>Select language</p>
                                        <select value={language} onChange={(e) => setLanguage(e.target.value)} >
                                            <option value="">None</option>
                                            {
                                                languages.map((item, idx) => (
                                                    <option value={item.text} key={idx}>{item.text}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                <button disabled={!title || !desc || !ending || !numberOfSeries || !language} className="btn" onClick={() => setCard(card + 1)}>Proceed</button>
                            </div>
                        </div>
                    )
                }

                {
                    card === 4 && (
                        <div className="content4">
                            <h3><img src={LogoImg} alt='logo'/> Ok, Famous writer,</h3>
                            <div className="body">
                                <div className="text">
                                    <p>Why do you want to write this story?</p>
                                    <small>{numberOfMotiveWords}/{maxMotiveWords}</small>
                                </div>
                                <textarea 
                                    name="" id="" cols="30" rows="10"
                                    placeholder={reason}
                                    value={motive}
                                    onChange={handleMotiveInputChange}
                                >
                                </textarea>
                            </div>

                            <button onClick={handleCreateStory} disabled={isButtonDisabled || loadingState} className="btn">{loadingState ? <Spinner /> : 'Proceed'}</button>
                        </div>
                    )
                }
            </div>
        </div>

    </div>
  )
}

export default CreateStory