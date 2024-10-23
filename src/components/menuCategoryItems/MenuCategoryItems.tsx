import React, { useEffect, useState } from 'react';
import { Modal, Card } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './style.module.css';
import defimg from '../../assets/img/pngwi.png'
import { useLocation } from 'react-router-dom';
import { IEstablishmentStyles, ILanguage, IMenuCategoryItems, ITranslation } from '../../interfaces/interfaces';



const MenuCategoryItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<IMenuCategoryItems[]>([]);
  const [, setError] = useState<string | null>(null);
  const [modalDescriptionVisibale , setModalDescriptionVisibale] = useState(false);
  const [newItem, setNewItem] = useState<Partial<IMenuCategoryItems> & { name: ITranslation, description: ITranslation  , img?: string | null }>({ 
    name: { en: '', am: '', ru: '' },
    description: { en: '', am: '', ru: '' },
    img: null,
    order: 0,
  }); 
  const { Meta } = Card;
  const [establishmentStyles, setEstablishmentStyles] = useState<IEstablishmentStyles>();
  const [currency, setCurrency] = useState<string>('');
  const pathname = useLocation().pathname || '';
  const establishmentId = pathname.split('/')[pathname.split('/').length - 2];
  const categoryId = pathname.split('/')[pathname.split('/').length - 1];
  const [userId, setUserId] = useState<string | null>(null);  
  const [currentLanguage, setCurrentLanguage] = useState<ILanguage>('en');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'am' || savedLanguage === 'ru') {
      setCurrentLanguage(savedLanguage);
    } else {
      localStorage.setItem('language', 'en');
    }
  }, [currentLanguage]);
  
  useEffect(() => {
    setUserId(pathname.split('/')[pathname.split('/').length-3])
    const fetchMenuItems = async () => {
      if (userId && establishmentId) {
        try {
          const docRef = doc(db, 'users', userId, 'establishments', establishmentId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const menuItems = data.menu?.items || {};
            const categoryItems = menuItems[categoryId] || {};
            setCurrency(data.info.currency)
            const items: IMenuCategoryItems[] = Object.entries(categoryItems).map(
              ([id, menuItem]: any) => ({
                id,
                name: menuItem.name,
                description: menuItem.description,
                img: menuItem.img,
                order: menuItem.order,
                price: menuItem.price,
                isVisible: menuItem.isVisible ?? true,
              })
            );
            items.sort((a, b) => a.order - b.order);
            setMenuItems(items);
            setEstablishmentStyles(data.styles)
            setCurrency(data.information.currency);
          } else {
            setError('No menu items found for this category');
          }
        } catch (error) {
          setError('Error fetching menu items');
        } finally {
        }
      }
    };
    
    fetchMenuItems();
  }, [userId, establishmentId, categoryId , pathname]);

  
  
  return (
    <div className={styles.menuCategoryItems} style={{backgroundColor: `#${establishmentStyles?.color1}` }}>
      <div className={styles.menuCategoryItemsList}>
        {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className={styles.menuCategoryItem} onClick={(e) => { 
                e.stopPropagation(); 
                setNewItem({
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  img: item.img
                });
                setModalDescriptionVisibale(true); 
              }} style={{border: `1px solid #${establishmentStyles?.color2}`}}>
                <div className={styles.menuCategoryItemCart}>
                  <div className={styles.up}   
                    style={{ height: establishmentStyles?.showImg ? '229px' : '40px' }}>
                    {establishmentStyles?.showImg ? (
                    <div className={styles.itemImg}>
                      <img
                        src={item.img || defimg}
                        alt={item.name[currentLanguage]}
                        width={150}
                        height={150}
                      />
                    </div>
                     ) : null}
                      <div className={styles.itemName} >
                        <span style={{color: `#${establishmentStyles?.color2}`}}>{item.name[currentLanguage]}</span>
                      </div>
                      <div className={styles.itemPrice}>
                        <span style={{color: `#${establishmentStyles?.color2}`}}>{item.price} {currency}</span>
                      </div>
                  </div>
                </div>
              </div>
            ))
          ) : null}
      </div>
      <Modal styles={{body: {backgroundColor: `#${establishmentStyles?.color1}`, width: 260 } , 
                                          content: {backgroundColor: `#${establishmentStyles?.color1}`, width: '306px' , margin: 'auto'}
        }} open={modalDescriptionVisibale} onCancel={() => {setModalDescriptionVisibale(false); }}footer={null} >
        <Card color={`#${establishmentStyles?.color2}`} cover={newItem.img && <img alt="" src={newItem.img} />}  style={{ width: 260, color: `#${establishmentStyles?.color2}` , background: 'none' , borderColor: `#${establishmentStyles?.color2}` }}>
          <Meta title={
                  <span style={{ color: `#${establishmentStyles?.color2}` }}>
                    {newItem.name[currentLanguage]}
                  </span>}
                description={
                  <span style={{ color: `#${establishmentStyles?.color2}` }}>
                    {newItem.description[currentLanguage]}
                  </span>}/>
        </Card>
      </Modal>    

    </div>
  );
};

export default MenuCategoryItems;
