import AddToCart from '../../components/addToCart/AddToCart';
import HeaderMenu from '../../components/headerMenu/HeaderMenu';
import MenuItemDetail from '../../components/menuItemDetail/MenuItemDetail';
import './style.css'

const MenuItemDescription:React.FC = () => {
    return <>
        <div className="menuItemDescription">
            <HeaderMenu />
            <MenuItemDetail />
            <AddToCart />
        </div>
    </>
}

export default MenuItemDescription;