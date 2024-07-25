import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

interface Categories {
    id: number;
    name: string;
}

const MenuCategoryNavigation: React.FC = () => {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        axios.get('https://menubyqr-default-rtdb.firebaseio.com/MENUBYQR/category.json')
            .then(response => {
                const data = response.data;
                const parsedCategories = Object.keys(data).map((key, index) => ({
                    id: index,
                    name: data[key].name,
                }));
                setCategories(parsedCategories);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const currentPath = location.pathname;
    const currentCategoryName = currentPath.split('/').pop() || '';

    return (
        <div className="menuCategoryNavigation">
            {categories.map(category => (
                <Link
                    key={category.id}
                    to={`/MENUBYQR/menu/${category.name}`}
                    className={currentCategoryName === category.name ? 'activeTab a' : 'a'}
>
                    {category.name}
                </Link>
            ))}
        </div>
    );
}

export default MenuCategoryNavigation;
