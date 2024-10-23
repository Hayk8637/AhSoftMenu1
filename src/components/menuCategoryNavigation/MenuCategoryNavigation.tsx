import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import styles from './style.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ICategory, IEstablishmentStyles, ILanguage, IMenuCategoryItem } from '../../interfaces/interfaces';
import { db } from '../../firebaseConfig';

const MenuCategoryNavigation: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [, setError] = useState<string | null>(null);
  const [establishmentStyles, setEstablishmentStyles] = useState<IEstablishmentStyles>();
  const pathnam = useLocation().pathname || '';
  const pathname = pathnam.split('/');
  const currentCategoryName = pathname.filter(Boolean).pop() || '';
  const establishmentId = pathname[pathname.length - 2] || '';
  const [userId, setUserId] = useState<string | null>(null);  
  const [currentLanguage, setCurrentLanguage] = useState<ILanguage>('en'); 
  const navigate = useNavigate(); // Use the useNavigate hook
  useEffect(()=>{
    if(!userId){
      setUserId(pathname[pathname.length-3]);
    }
  }, [pathname, userId])
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'am' || savedLanguage === 'ru') {
      setCurrentLanguage(savedLanguage);
    } else {
      localStorage.setItem('language', 'en');
    }
  }, []);
  
  useEffect(() => {
    
    const fetchCategories = async () => {
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
            items.sort((a, b) => a.order - b.order);
            setEstablishmentStyles(data.styles);
            setCategories(items);
          } else {
            setError('No categories found');
          }
        } catch (error) {
          setError('Error fetching menu items');
        }
      }
    };
    fetchCategories();
  }, [userId, establishmentId]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/${userId}/${establishmentId}/${categoryId}`);
  };

  return (
    <div className={styles.menuCategoryNavigation} style={{backgroundColor: `#${establishmentStyles?.color1}`}}>
      {categories.map((category) => ( 
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={currentCategoryName === category.id ? styles.activeTab : styles.a} 
          style={{
            color: currentCategoryName === category.id ? `#${establishmentStyles?.color1}` : `#${establishmentStyles?.color2}`,
            backgroundColor: currentCategoryName === category.id ? `#${establishmentStyles?.color2}` : ``,
            borderColor: currentCategoryName === category.id ? `` : `#${establishmentStyles?.color2}`
          }}
        >
          {category.name[currentLanguage]}
        </div>
      ))}
    </div>
  );
};

export default MenuCategoryNavigation;
