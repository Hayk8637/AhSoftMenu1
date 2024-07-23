import logo from '../../assets/logo/English.png'
import './style.css'
import {  ShoppingCartOutlined } from '@ant-design/icons'
// SearchOutlined, 
const Header:React.FC = () => {
    return <>
        <div className='header'>
            <div className='leftRight'>
                <div className='left'>
                    <img src={logo} alt="logo" />
                </div>
                <div className='right'>
                    {/* <a className='heart' href="/heart"><img src={heart} alt="" /></a> */}
                    <a className='cart' href="/MENUBYQR/cart"><ShoppingCartOutlined style={{ color: 'black' }}/></a>
                </div>
            </div>
                {/* <form className='search' >
                    <input type="text" id="searchInput" />
                    <button type="submit"><SearchOutlined style={{ color: 'black' }}/></button>
                </form> */}
        </div>
    </>
}
export default Header