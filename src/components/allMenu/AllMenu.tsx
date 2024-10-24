import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import style from './style.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { IEstablishmentStyles, ILanguage, IMenuCategoryItem } from '../../interfaces/interfaces';
import { Button } from 'antd';


const AllMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<IMenuCategoryItem[]>([]);
  const [establishmentStyles, setEstablishmentStyles] = useState<IEstablishmentStyles>();
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const pathname = useLocation().pathname || '';
  const establishmentId = pathname.split('/').filter(Boolean).pop() || '';
  const [currentLanguage, setCurrentLanguage] = useState<ILanguage>('en');
  const [isBannerImages , setBannerImages] = useState(false)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'am' || savedLanguage === 'ru') {
      setCurrentLanguage(savedLanguage);
    } else {
      localStorage.setItem('language', 'en');
    }
  }, [currentLanguage]);

  useEffect(() => {
    setUserId(pathname.split('/')[pathname.split('/').length-2])
    const fetchMenuItems = async () => {
      if (userId && establishmentId) {
        try {
          const docRef = doc(db, 'users', userId, 'establishments', establishmentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const categories = data.menu?.categories || {};
            const items: IMenuCategoryItem[] = Object.entries(categories).map(([id, category]: any) => ({
              id,
              name: category.name,
              order: category.order,
              imgUrl: category.imgUrl,
              isVisible: category.isVisible ?? true,
            }));
            await setEstablishmentStyles(data.styles);
            items.sort((a, b) => a.order - b.order);
            setMenuItems(items);
            setBannerImages(data.bannerUrls.exists)
          } else {
          }
        } catch (error) {
        }
      }
    };
    fetchMenuItems();
  }, [userId,establishmentId, pathname ]);


  return (
    <div className={style.allMenu} style={{backgroundColor: `#${establishmentStyles?.color1}` ,  minHeight: isBannerImages ? 'calc(100vh - 346px)' : 'calc(100vh - 115px)' }}>
      <div className={style.menuCategories}>
      {menuItems.map(item => (
        <Button
        key={item.id}
        className={style.menuCategoryItem}
        style={{
          border: `1px solid #${establishmentStyles?.color2}`,
          backgroundColor: `#${establishmentStyles?.color4}`,
          backgroundImage: establishmentStyles?.showImg ? `url(${item.imgUrl || ''})` : 'none',
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.closest('.ant-popover')) {
            navigate(`./${item.id}`);
          }
        }}
      >
        <a href={`./${item.id}`} style={{ color: `#${establishmentStyles?.color2}`}} >{item.name[currentLanguage]}</a>
      </Button>
      
      ))}
      </div>
    </div>
  );
};

export default AllMenu;
 