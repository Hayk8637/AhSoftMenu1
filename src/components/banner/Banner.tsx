import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import { Carousel } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useLocation } from 'react-router-dom';
import { IBannerImage, IEstablishmentStyles } from '../../interfaces/interfaces';

const contentStyle: React.CSSProperties = {
  height: '200px',  
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '22px',
};

const Banner: React.FC = () => {
  const [bannerImages, setBannerImages] = useState<IBannerImage[]>([]);
  const pathname = useLocation().pathname || '';
  const establishmentId = pathname.split('/').filter(Boolean).pop() || '';
  const [establishmentStyles, setEstablishmentStyles] = useState<IEstablishmentStyles>();
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    setUserId(pathname.split('/')[pathname.split('/').length-2])
    const fetchBanners = async () => {
      if (userId && establishmentId) {
          const docRef = doc(db, 'users', userId, 'establishments', establishmentId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.info?.bannerUrls) {
              const parsedItems = Object.keys(data.info.bannerUrls).map((key) => ({
                id: key,
                url: data.info.bannerUrls[key] as string,
              }));
              setBannerImages(parsedItems);
              setEstablishmentStyles(data.styles);
            }
          } else {
             return;
          }
        }
    };

    fetchBanners();
  }, [userId, establishmentId, pathname]);
  
  
  return (
    <div className={styles.banner} style={{backgroundColor: `#${establishmentStyles?.color1}`}}>
      {bannerImages.length === 0 ? (
        null
      ) : (
        <div style={{ position: 'relative' }}>
          <Carousel autoplay autoplaySpeed={4000} speed={1000} className={styles.bannerCarousel} dots={false}>
            {bannerImages.map((image) => (
              <div key={image.id}>
                <div style={contentStyle}>
                  <img
                    src={image.url || ''}
                    alt={`Banner ${image.id}`}
                    style={{ objectFit: 'cover' }}
                    className={styles.carouselImage} 
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default Banner;