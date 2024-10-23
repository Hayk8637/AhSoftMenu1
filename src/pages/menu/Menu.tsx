import HeaderMenu from '../../components/headerMenu/HeaderMenu'
import MenuCategoryItems from '../../components/menuCategoryItems/MenuCategoryItems'
import MenuCategoryNavigation from '../../components/menuCategoryNavigation/MenuCategoryNavigation'
import './style.css'

const Menu:React.FC = () => {
    return <>
        <div className="menu">
            {/* <div className='header'> */}
                <HeaderMenu/>
                <MenuCategoryNavigation/>
            {/* </div> */}
            
            <MenuCategoryItems />
        </div>
    </>
}
export default Menu