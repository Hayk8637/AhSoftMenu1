import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined, CopyOutlined, WifiOutlined, PhoneOutlined, LockOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Button, notification, Popover } from 'antd';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styles from './style.module.css';
import { useLocation } from 'react-router-dom';
import { IEstablishment, IEstablishmentStyles, IInfoValues, ILanguages } from '../../interfaces/interfaces';



const Header: React.FC = () => {
  const currentPath = useLocation().pathname || '';
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const establishmentId = currentPath.split('/').filter(Boolean).pop() || '';
  const [establishmentStyles, setEstablishmentStyles] = useState<IEstablishmentStyles>();
  const [textColor, setTextColor] = useState(`#${establishmentStyles?.color2 || 'white'}`);
  const [userId, setUserId] = useState<string | null>(null);
  const [languages, setLanguages] = useState< ILanguages | null>(null);
  const [popoverData, setPopoverData] = useState<IInfoValues>({
    wifiname: '',
    wifipass: '',
    address: '',
    phone: '',
    currency: '',
  });
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      localStorage.setItem('language', 'en');
    }
  }, []);

  useEffect(() => {
    if (!currentLanguage) {
      if (languages?.en) {
        setCurrentLanguage('en');
      } else if (languages?.ru) {
        setCurrentLanguage('ru');
      } else if (languages?.am) {
        setCurrentLanguage('am');
      }
    }
  }, [currentLanguage, languages]);
  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    window.location.reload(); 
};
  useEffect(() => {
    setUserId(currentPath.split('/')[currentPath.split('/').length-2])
    if (userId && establishmentId) {
      const fetchEstablishmentData = async () => {
        try {
          if (!userId) {
            notification.error({ message: 'Error', description: 'User is not authenticated' });
            return;
          }
          const db = getFirestore();
          const docRef = doc(db, 'users', userId, 'establishments', establishmentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as IEstablishment;
            setLogoUrl(data.info?.logoUrl || './MBQR Label-03.png');
            setPopoverData({
              wifiname: data.info?.wifiname || '',
              wifipass: data.info?.wifipass || '',
              address: data.info?.address || '',
              phone: data.info?.phone || '',
              currency: data.info?.currency || ''
          });
           await setEstablishmentStyles(data.styles);
           await setLanguages({
              en: data.languages.en,
              am: data.languages.am,
              ru: data.languages.ru
             })
          } else {
            notification.error({ message: 'Error', description: 'Document does not exist' });
          }
        } catch (error) {
          notification.error({ message: 'Error', description: 'Failed to fetch establishment data' });
        }
      };
      fetchEstablishmentData();
    }
  }, [establishmentId , userId , currentPath]);
  


  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      notification.success({ message: 'Copied to clipboard', description: text });
    }).catch(() => {
      notification.error({ message: 'Failed to copy', description: 'Unable to copy text' });
    });
  };
  const truncateText = (text: string, maxLength = 15) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  
  const popoverContent = (
    <div style={{ width: '240px' , backgroundColor: `#${establishmentStyles?.color1}`, color: `#${establishmentStyles?.color2}`, border: 'none' }}>
      {[
        { icon: <WifiOutlined size={32} />, label: 'WiFi Name', value: popoverData.wifiname },
        { icon: <LockOutlined />, label: 'WiFi Password', value: popoverData.wifipass },
        { icon: <EnvironmentOutlined />, label: 'Address', value: popoverData.address },
        { icon: <PhoneOutlined />, label: 'Phone', value: popoverData.phone },
      ].map(({ icon, label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , border: 'none' }}>
          <p>
            <strong>{icon}: </strong> {truncateText(value)}
          </p>
          <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(value)} style={{backgroundColor: `#${establishmentStyles?.color1}`, color: `#${establishmentStyles?.color2}` , borderColor: `#${establishmentStyles?.color2}`}}>Copy</Button>
        </div>
      ))}
    </div>
  );
  

  return (
    <>
      <div className={styles.header} style={{backgroundColor: `#${establishmentStyles?.color1}` , borderBottomColor: `#${establishmentStyles?.color2}`}} >
        <div className={styles.leftRight}>
          <div className={styles.left}>

          </div>
          <div className={styles.center}>
              {logoUrl && (
                <img src={logoUrl} alt="Logo" width={120} height={50} style={{ objectFit: 'contain' }}/>
              )}
          </div>
          <div className={styles.right}>
          {(languages?.am || languages?.en || languages?.ru) ? (
          <select
            className={styles.languageCheck}
            style={{
              background: 'none',
              border: 'none',
              color: `#${establishmentStyles?.color2}`,
              fontSize: '18px'
            }}
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {Object.keys(languages)
              .filter((lang) => languages[lang as keyof ILanguages])
              .map((language) => (
                <option
                  key={language}
                  value={language}
                  style={{
                    background: 'none',
                    color: establishmentStyles?.color2
                  }}
                >
                  {language.toUpperCase()}
                </option> 
              ))}
          </select>
        ) : null}

            <Popover placement="bottomRight" content={popoverContent} arrow color={`#${establishmentStyles?.color1}`}> 
              <Button type="link" className={styles.info} 
               style={{ color: textColor }}
                  onMouseEnter={() => setTextColor(`#${establishmentStyles?.color3}`)}
                  onMouseLeave={() => setTextColor(`#${establishmentStyles?.color2}`)}
                  onFocus={() => setTextColor(`#${establishmentStyles?.color3}`)}
                  onBlur={() => setTextColor(`#${establishmentStyles?.color2}`)} 
                  onMouseDown={() => setTextColor(`#${establishmentStyles?.color3}`)} 
                  onMouseUp={() => setTextColor(`#${establishmentStyles?.color3}`)} >
                <InfoCircleOutlined style={{color: `#${establishmentStyles?.color2}`}}/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
