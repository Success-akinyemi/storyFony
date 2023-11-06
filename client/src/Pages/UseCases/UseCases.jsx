import FAQ from '../../Components/FAQ/FAQ'
import Footer from '../../Components/Footer/Footer'
import Navbar from '../../Components/Navbar/Navbar'
import UseCasesBanner from '../../Components/UseCasesBanner/UseCasesBanner'
import { faq } from '../../data/faq'
import { useCasesData } from '../../data/useCases'
import './UseCases.css'

function UseCases() {
  return (
    <div className='useCases'>
        <Navbar enableScrollEffect={true} />
        <div className="useCasesHero">
            <div className="content">
                <h1>Different use case of StoryFony AI to write story</h1>
                <p>Impress your audience with interesting short stories created by AI</p>
            </div>
        </div>
        <UseCasesBanner data={useCasesData} />
        <FAQ faq={faq} />
        <Footer />
    </div>
  )
}

export default UseCases