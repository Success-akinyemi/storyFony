import './BookSummary.css'
import PenImg from '../../../assets/pen2.png'

function BookSummary() {
  return (
    <div className='bookSummary'>
        <p className="text">You can edit your story line</p>
        <div className="inputfield">
            <textarea></textarea>
            <button className="motive">Generate new story line</button>
        </div>
        <button className="rewrite">
            Rewrite the whole story
            <img src={PenImg} className="pen" />
        </button>
    </div>
  )
}

export default BookSummary