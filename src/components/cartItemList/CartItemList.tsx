import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import { useCart } from '../../context/CartContext';

interface FullCartItem {
  id: number;
  img: string;
  name: string;
  price: number;
  currency: string;
  count: number;
}

const CartItemList: React.FC = () => {
  const { cart, incrementItemCount, decrementItemCount, removeFromCart } = useCart();
  const [cartItems, setCartItems] = useState<FullCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const items = await Promise.all(
          cart.map(async (cartItem) => {
            const url = `https://menubyqr-default-rtdb.firebaseio.com/MENUBYQR/${cartItem.category}/${cartItem.id}.json`;
            const response = await axios.get(url);
            return { id: cartItem.id, ...response.data, count: cartItem.count } as FullCartItem;
          })
        );
        setCartItems(items);
      } catch (error) {
        setError('Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [cart]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cartItemList">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
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
                      <button className="minus" onClick={() => decrementItemCount(item.id)}>-</button>
                      <div>
                        <span>{item.count}</span>
                      </div>
                      <button className="plus" onClick={() => incrementItemCount(item.id)}>+</button>
                    </div>
                    {/* <button onClick={() => removeFromCart(item.id)}>Remove</button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CartItemList;
