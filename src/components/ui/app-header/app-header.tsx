import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import clsx from 'clsx';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

// export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
//   <header className={styles.header}>
//     <nav className={`${styles.menu} p-4`}>
//       <div className={styles.menu_part_left}>
//         <Link to='/'>
//           <BurgerIcon type={'primary'} />
//           <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
//         </Link>
//         <Link to='/feed'>
//           <ListIcon type={'primary'} />
//           <p className='text text_type_main-default ml-2'>Лента заказов</p>
//         </Link>
//       </div>
//       <div className={styles.logo}>
//         <Logo className='' />
//       </div>
//       <Link to='/profile'>
//         <div className={styles.link_position_last}>
//           <ProfileIcon type={'primary'} />
//           <p className='text text_type_main-default ml-2'>
//             {userName || 'Личный кабинет'}
//           </p>
//         </div>
//       </Link>
//     </nav>
//   </header>
// );

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={clsx(styles.link, {
              [styles.link_active]: location.pathname === '/'
            })}
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={clsx(styles.link, {
              [styles.link_active]: location.pathname === '/feed'
            })}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <Link to='/profile'>
          <div
            className={clsx(styles.link_position_last, styles.link, {
              [styles.link_active]: location.pathname === '/profile'
            })}
          >
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </div>
        </Link>
      </nav>
    </header>
  );
};
