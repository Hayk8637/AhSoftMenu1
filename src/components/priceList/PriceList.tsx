import React from 'react';
import { useCart } from '../../context/CartContext'; // Import useCart
import './style.css';

const PriceList: React.FC = () => {
    const { getTotalPrice } = useCart(); // Access getTotalPrice from the cart context

    const totalPrice = getTotalPrice(); // Call getTotalPrice to get the total price

    return (
        <div className='priceList'>
            <div className="priceList0">
                <div className="allPrice">
                    <h1>Total Price</h1>
                    <span>{totalPrice.toFixed(2)}$</span> {/* Display total price */}
                </div>
            </div>
        </div>
    );
};

export default PriceList;