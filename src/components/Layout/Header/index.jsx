// Module CSS
import S from './style.module.css';
// Libraries
import { useState, useEffect } from 'react';
// API
import { api, axiosPublic } from '../../../api';
// Components
import Loader from '../../Loader';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api(axiosPublic.get('/api/vast/users'), {
      onSuccess: (data) => setUser(data),
    });
  }, []);

  return (
    <header className={S.header}>
      <div className={S.left}>
        <div className={S.logo}>
          <span className={S.logoAi}>AI</span>
          <div className={S.logoDivider} />
          <span className={S.logoOfm}>OFM</span>
        </div>
      </div>
      <div className={S.right}>
        {user === null 
          ? (<Loader color="var(--accent-primary)" width={40} height={10} />) 
          : (<div className={S.userInfo}>
               <span className={S.userId}>{user.id}</span>
               <span className={S.divider}>|</span>
               <span className={S.username}>{user.username}</span>
               <span className={S.divider}>|</span>
               <span className={S.credit}>${user.credit.toFixed(2)}</span>
             </div>)
        }
      </div>
    </header>
  );
};

export default Header;
