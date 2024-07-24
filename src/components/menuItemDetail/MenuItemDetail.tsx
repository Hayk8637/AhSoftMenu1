import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

interface MenuItemDetailData {
    id: number;
    img: string;
    name: string;
    desc: string;
    price: number;
    currency: string;
}

const MenuItemDetail: React.FC = () => {
    const [menuItemDetail, setMenuItemDetail] = useState<MenuItemDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<MenuItemDetailData>('https://api.example.com/menu-item-detail')
            .then(response => {
                setMenuItemDetail(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!menuItemDetail) return <div>No data available</div>;

    return (
        <div className='menuItemDetail'>
            <div className="itemInfo">
                <div className="itemImg">
                    <img src={menuItemDetail.img} alt={menuItemDetail.name} />
                </div>
                <div className="itemName">
                    <h1>{menuItemDetail.name}</h1>
                </div>
                <div className="itemDescription">
                    <h1>Description</h1>
                    <span>{menuItemDetail.desc}</span>
                </div>
                <div className="itemPrice">
                    <span>{menuItemDetail.currency} {menuItemDetail.price}</span>
                </div>
            </div>
        </div>
    );
}

export default MenuItemDetail;
