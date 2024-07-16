import CartItemList from '../../components/cartItemList/CartItemList';
import HeaderMenu from '../../components/headerMenu/HeaderMenu';
import Pay from '../../components/pay/Pay';
import PriceList from '../../components/priceList/PriceList';
import './style.css'
const Cart:React.FC = () => {
    return <>
        <div className="cart">
            <HeaderMenu />
            <CartItemList />
            <PriceList />
            <Pay />
        </div>
    </>
}
export default Cart;