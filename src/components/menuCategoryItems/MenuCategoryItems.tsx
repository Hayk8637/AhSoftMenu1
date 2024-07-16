import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import heart from '../../assets/icons/heart.png';
import burgerImage from './pngwing 1.png';

interface MenuCategoryItem {
    id: number;
    name: string;
    price: number;
    currency: string;
}

const MenuCategoryItems: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuCategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<MenuCategoryItem[]>('https://api.example.com/menu-items')
            .then(response => {
                setMenuItems(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ marginTop: '200px' }}>Error: {error}</div>;

    return (
        <div className="menuCategoryItems">
            <div className="menuCategoryItemsList">
                {menuItems.map(item => (
                    <div key={item.id} className="menuCategoryItem">
                        <div className='menuCategoryItemCart'>
                            <div className="up">
                                <a href={`/menu/${item.id}`}>
                                    <div className="itemImg">
                                        <img src={burgerImage} alt="Burger" />
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
                ))}
            </div>
        </div>
    );
}

export default MenuCategoryItems;
