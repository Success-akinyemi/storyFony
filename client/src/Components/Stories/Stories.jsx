import BannerImg from '../Helpers/BannerImg/BannerImg'
import './Stories.css'
import IconImg from '../../assets/icon.png'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

function Stories({ data }) {
  return (
    <div className='stories'>
        <div className="top">
            <h1 className='title'>See amazing stories <br />#madewithstoryFony</h1>
            <p className='footNote'>The Future of Writing: AI-Powered Storytelling</p>
        </div>

        <div className="body">
            {
                data.map((item, idx) => (
                    <div className="card" key={idx}>
                        <BannerImg 
                            title={item.title}
                            tag={item.tag}
                            img={item.img}
                            author={item.author}
                            authorImg={item.authorImg}
                            heart={item.heart}
                            likes={item.likes}
                        />
                    </div>
                ))
            }
        </div>

        <Link className="link moreBtn">
            <img className='icon' alt='icon' src={IconImg} /> 
                View more stories
            <ArrowForwardIcon className='arrowIcon' />
        </Link>
    </div>
  )
}

export default Stories