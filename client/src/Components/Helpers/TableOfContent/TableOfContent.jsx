import './TableOfContent.css'
import PenImg from '../../../assets/pen3.png'
import DotsImg from '../../../assets/dragDot.png'
import AddImg from '../../../assets/add.png'

function TableOfContent({storyChapter, onChapterClick }) {
  return (
    <div className='tableOfContent'>
        <div className='t-card'>
            {
                storyChapter.map((item) => (
                    <div className='t-cardList' key={item.chapterNumber} onClick={() => onChapterClick(item.chapterContent)}>
                        <div className="contentLeft">
                            <img src={DotsImg} />
                        </div>

                        <div className="contentRight">
                            <h3>{item?.chapterNumber}</h3>
                            <span>
                                <p>{item?.chapterTitle}</p>
                                <img src={PenImg} />
                            </span>
                        </div>
                    </div>
                ))
            }
        </div>

        <div className="newCapter">
            <img src={AddImg} />
            <p>Add new chapter</p>
        </div>
    </div>
  )
}

export default TableOfContent