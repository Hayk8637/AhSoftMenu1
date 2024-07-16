import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

interface MenuCategoryItem {
    id: number;
    img: string;
    name: string;
}

const AllMenu: React.FC = () => {
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
    if (error) return <div>Empty data</div>;

    return (
        <div className="allMenu">
            <h1>All Menu</h1>
            <div className="menuCategories">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className="menuCategoryItem"
                        style={{
                            backgroundImage: `url(${item.img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        onClick={() => window.location.href = '/menu'}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AllMenu;
