import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './style.css';
import heart from '../../assets/icons/heart.png';
import burgerImage from './pngwing 1.png';

interface MenuCategoryItem {
    id: number;
    name: string;
    img: string;
    price: number;
    currency: string;
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

                const isValidItem = (item: any) => {
                    return item?.name && item?.price && item?.currency && item?.img;
                };

                const parsedItems = Array.isArray(data) ? 
                    data.map((item, index) => ({
                        id: index + 1, 
                        name: item?.name || '',
                        price: item?.price || 0,
                        currency: item?.currency || '$',
                        img: item?.img || ''
                    })).filter(isValidItem) 
                    : Object.keys(data).map((key, index) => ({
                        id: index + 1, 
                        name: data[key]?.name || '',
                        price: data[key]?.price || 0,
                        currency: data[key]?.currency || '$',
                        img: data[key]?.img || ''
                    })).filter(isValidItem); 
                
                setMenuItems(parsedItems);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [category]);

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
                                    <button className='cart'>Add to Cart</button>
                                    <button className='heart'><img src={heart} alt="Heart" /></button>
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
}

export default MenuCategoryItems;
