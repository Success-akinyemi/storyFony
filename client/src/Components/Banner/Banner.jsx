import { bannerInfoOne, bannerInfoTwo } from '../../data/banner'
import StarRating from '../Helpers/StarRating/StarRating'
import './Banner.css'
import Img1 from '../../assets/Img2.png'
import Img2 from '../../assets/Img1.png'
import Img3 from '../../assets/Img3.png'
import Img4 from '../../assets/Img4.png'
import Img5 from '../../assets/Img5.png'
import Img6 from '../../assets/Img6.png'
import Img7 from '../../assets/Img7.png'

import DpImg from '../../assets/dp.png'
import BannerImg from '../Helpers/BannerImg/BannerImg'
import BannerImgSmall from '../Helpers/BannerImgSmall/BannerImgSmall'


function Banner() {
    const { title, info, text, author, authorRole, rating } = bannerInfoOne
    const { title2, info2, text2, author2, authorRole2, rating2 } = bannerInfoTwo
  
    return (
    <div className='banner' >
        <div className="top">
            <div className="left">
                <h1 className="hTitle">{title}</h1>
                <span className="info">{info}</span>
                <div className="card">
                    <div className="text">
                        {text}
                    </div>
                    <span className="stars">
                        <StarRating count={rating} />
                    </span>
                </div>

                <div className="foot">
                    <div className="image"></div>
                    <div className="imageInfo">
                        <span className='spanA'>{author}</span>
                        <span className='spanB'>{authorRole}</span>
                    </div>
                </div>
            </div>

            <div className="right">
                <div className="content">
                    <div className="card">
                        <BannerImg 
                            img={Img1}
                            tag={'Detective'}
                            title={'The Midnight Mysteries Series and  Investigations Saga'}
                            author={'famous-writer'}
                            authorImg={DpImg}
                            heart={true}
                            likes={12500}
                        />
                    </div>

                    <div className="card">
                        <BannerImg 
                            img={Img2}
                            tag={'Fiction'}
                            title={'Jamin and the Hilarious City  night workaholic'}
                            author={'Bedtime-spirit'}
                            authorImg={DpImg}
                            heart={false}
                            likes={341}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="bottom">
            <div className="left">
                <h1 className="hTitle">{title2}</h1>
                <span className="info">{info2}</span>
                <div className="card">
                    <div className="text">
                        {text2}
                    </div>
                    <span className="stars">
                        <StarRating count={rating2} />
                    </span>
                </div>

                <div className="foot">
                    <div className="image"></div>
                    <div className="imageInfo">
                        <span className='spanA'>{author2}</span>
                        <span className='spanB'>{authorRole2}</span>
                    </div>
                </div>
            </div>

            <div className="right">
                <div className="content">
                <div className="up">
                    <div className="card">
                        <BannerImgSmall 
                            img={Img3}
                            tag={'Fiction'}
                            title={"The Sleuth's Secrets Series and the Detective Chronicles"}
                            author={'Bedtime-spirit'}
                            authorImg={DpImg}
                            heart={false}
                            likes={341}
                        />
                    </div>

                    <div className="card">
                        <BannerImgSmall 
                            img={Img4}
                            tag={'Adventure'}
                            title={"The Inspector's Quest and Noir Detective Adventures"}
                            author={'Famous-writer'}
                            authorImg={DpImg}
                            heart={false}
                            likes={0}
                        />
                    </div>

                    <div className="card">
                        <BannerImgSmall 
                            img={Img5}
                            tag={'Romance'}
                            title={"The Intrigue Investigations and Clue Hunter Chronicles"}
                            author={'Angel-writer'}
                            authorImg={DpImg}
                            heart={false}
                            likes={20}
                        />
                    </div>
                </div>

                <div className="down">
                    <div className="card">
                        <BannerImgSmall 
                            img={Img6}
                            tag={'Detective'}
                            title={"The Crime Solver Mysteries and Detective Adventures"}
                            author={'Famous-writer'}
                            authorImg={DpImg}
                            heart={false}
                            likes={12500}
                        />
                    </div>

                    <div className="card">
                        <BannerImgSmall 
                            img={Img7}
                            tag={'Yound adult'}
                            title={"The Whodunit Chronicles and Private Eye Files"}
                            author={'Famous-writer'}
                            authorImg={DpImg}
                            heart={false}
                            likes={12500}
                        />
                    </div>

                    <div className="card">
                        <BannerImgSmall 
                            img={Img1}
                            tag={'Detective'}
                            title={"The Crime Solver Mysteries and Enigma Files"}
                            author={'Famous-writer'}
                            authorImg={DpImg}
                            heart={true}
                            likes={12500}
                        />
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Banner