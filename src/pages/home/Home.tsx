import AllMenu from '../../components/allMenu/AllMenu'
import Banner from '../../components/banner/Banner'
import CallWaiter from '../../components/callWaiter/CallWaiter'
import Header from '../../components/header/Header'
import './style.css'

const Home:React.FC = () => {
    return <>
        <div className='home'>
                <Header/>
                <Banner/>
                <AllMenu/>
                <CallWaiter/>
        </div>
    </>
}

export default Home