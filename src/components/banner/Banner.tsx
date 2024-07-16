import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import { Carousel } from 'antd';

interface BannerImage {
    id: number;
    imageUrl: string;
}

const contentStyle: React.CSSProperties = {
    height: '184px',
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
    borderRadius: '22px',
};

const Banner: React.FC = () => {
    const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<BannerImage[]>('https://api.example.com/banner-images')
            .then(response => {
                setBannerImages(response.data);
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
        <div className='banner'>
            <Carousel autoplay autoplaySpeed={4000} speed={1000} className='bannerCarousel'>
                {bannerImages.map(image => (
                    <div key={image.id}>
                        <div style={{ ...contentStyle, backgroundImage: `url(${image.imageUrl})` }}>
                            <h3>{image.id}</h3>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default Banner;
