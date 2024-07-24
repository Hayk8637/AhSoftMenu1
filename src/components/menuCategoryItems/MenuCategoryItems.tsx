import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './style.css';
import heart from '../../assets/icons/heart.png';
import burgerImage from './pngwing 1.png';
import { useCart } from '../../context/CartContext';

interface MenuCategoryItem {
  id: number;
  name: string;
  img: string;
  price: number;
  currency: string;
  category: string;
}

const MenuCategoryItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const category = location.pathname.split('/').pop() || '';

  useEffect(() => {
    const url = `https://menubyqr-default-rtdb.firebaseio.com/MENUBYQR/${category}.json`;

    axios.get(url)
      .then(response => {
        const data = response.data;

        const isValidItem = (item: any) => item?.name && item?.price && item?.currency && item?.img;

        const parsedItems = Array.isArray(data) 
          ? data.map((item: any, index: number) => ({
              id: index,
              name: item?.name || '',
              price: item?.price || 0,
              currency: item?.currency || '$',
              img: item?.img || '',
              category
            })).filter(isValidItem)
          : Object.keys(data).map((key: string, index: number) => ({
              id: index ,
              name: data[key]?.name || '',
              price: data[key]?.price || 0,
              currency: data[key]?.currency || '$',
              img: data[key]?.img || '',
              category
            })).filter(isValidItem);

        setMenuItems(parsedItems);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch menu items');
        setLoading(false);
      });
  }, [category]);

  const { addToCart } = useCart();

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ marginTop: '200px' }}>Error: {error}</div>;

  return (
    <div className="menuCategoryItems">
      <div className="menuCategoryItemsList">
        {menuItems.length > 0 ? (
          menuItems.map(item => (
            <div key={item.id} className="menuCategoryItem">
              <div className='menuCategoryItemCart'>
                <div className="up">
                  <a href={`/menu/${item.id}`}>
                    <div className="itemImg">
                      <img src={item.img || burgerImage} alt={item.name} />
                    </div>
                    <div className="itemName">
                      <span>{item.name}</span>
                    </div>
                    <div className="itemPrice">
                      <span>{item.currency}{item.price}</span>
                    </div>
                  </a>
                </div>
                <div className="down">
                  <button
                    className='cart'
                    onClick={() => {
                      addToCart({ id: item.id, category: item.category,price: item.price, count: 1 }); 
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className='heart'>
                    <img src={heart} alt="Heart" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No items available</div>
        )}
      </div>
    </div>
  );
};

export default MenuCategoryItems;
