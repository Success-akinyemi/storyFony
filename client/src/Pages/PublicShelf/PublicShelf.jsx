import AuthUserNavbar from '../../Components/AuthUserNavbar/AuthUserNavbar'
import './PublicShelf.css'

function PublicShelf() {
  return (
    <div className='publicShelf'>
        <AuthUserNavbar enableScrollEffect={true} miniNav={false} />
        <div className='publicShelfHero'>
            <div className="container">
                <div className="top">
                    <h2>Welcome to StoryFony public story shelf</h2>
                    <p>Discover amazing story that captures the essence of their extraordinary journey, humor, and budding romance</p>
                </div>
                <div className="search">
                    <input type="text" placeholder='Enter story title' />
                    <div className="btn">Search for story</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PublicShelf