import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

interface Categories {
    id: number;
    name: string;
}

const MenuCategoryNavigation: React.FC = () => {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<Categories[]>('https://api.example.com/categories')
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="menuCategoryNavigation">
            {categories.map(category => (
                <a key={category.id} href={`menu/c/${category.id}`} className={category.id === 1 ? 'activeTab' : ''}>
                    {category.name}
                </a>
            ))}
        </div>
    );
}

export default MenuCategoryNavigation;
