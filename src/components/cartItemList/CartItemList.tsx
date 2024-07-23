import React from 'react';
import './style.css'; // Ensure this path is correct
import img from './Group 143.png';

interface CartItem {
    id: number;
    img: string;
    name: string;
    price: number;
    currency: string;
}

const cartItems: CartItem[] = [
    {
        id: 1,
        img: img,
        name: "18k White Gold Plated Pendant Necklace",
        price: 4000,
        currency: '$'
    }
];

const CartItemList: React.FC = () => {
    return (
        <div className="cartItemList">
            {cartItems.map((item) => (
                <div key={item.id} className="cartItem">
                    <div className="cartItemDet">
                        <div className="left">
                            <img src={item.img} alt={item.name} />
                        </div>
                        <div className="right">
                            <div className="name">
                                <h1>{item.name}</h1>
                            </div>
                            <div className="price">
                                <h2>{item.currency}{item.price}</h2>
                            </div>
                            <div className="orderManage">
                                <div className="countManage">
                                    <button className="minus">-</button>
                                    <div>
                                        <span>3</span>
                                    </div>
                                    <button className="plus">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CartItemList;
