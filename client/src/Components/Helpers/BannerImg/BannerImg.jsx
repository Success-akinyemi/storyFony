import './BannerImg.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function BannerImg({ img, tag, title, likes, heart, author, authorImg }) {
  return (
    <div className="bannerImg">
      <img src={img} className='mainImg' alt='image' />
      <span className='tag'>{tag}</span>
      
      <div className="bannerImgInfo">
        <div className="top">
          <p>{title}</p>
          <p className="btn">Read story book</p>
        </div>
        <div className="bottom">
          <div className="left">
            <span className="image">
              <img src={authorImg}  className='authorImg' alt={`${author}`}/>
            </span>
            <span className='author'>{author}</span>
          </div>
          <div className="right">
            <span className='heartBox'>
              <FavoriteBorderIcon className={`heartIcon ${ heart ? 'red' : ''}`} />
            </span>
            <span className="likes">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerImg