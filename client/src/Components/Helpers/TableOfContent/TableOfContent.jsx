import './TableOfContent.css'
import PenImg from '../../../assets/pen3.png'
import DotsImg from '../../../assets/dragDot.png'
import AddImg from '../../../assets/add.png'

function TableOfContent() {
  return (
    <div className='tableOfContent'>
        <div className='t-card'>
            <div className="left">
                <img src={DotsImg} />
            </div>

            <div className="right">
                <h3>Chapter 1</h3>
                <span>
                    <p>Title</p>
                    <img src={PenImg} />
                </span>
            </div>
        </div>

        <div className="newCapter">
            <img src={AddImg} />
            <p>Add new chapter</p>
        </div>
    </div>
  )
}

export default TableOfContent