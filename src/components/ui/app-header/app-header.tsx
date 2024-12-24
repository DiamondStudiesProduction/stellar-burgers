import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <NavLink to='/' className={styles.link}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'disabled'} />
                <p
                  className={`text text_type_main-default ml-2 mr-10 ${isActive ? styles.link_active : ''}`}
                >
                  Конструктор
                </p>
              </>
            )}
          </NavLink>
        </>
        <>
          <NavLink to='/feed' className={styles.link}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'disabled'} />
                <p
                  className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : ''}`}
                >
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </>
      </div>
      <div className={styles.logo}>
        <NavLink to='/'>
          <Logo className='' />
        </NavLink>
      </div>
      <div className={styles.link_position_last}>
        <NavLink to='/profile' className={styles.link}>
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'disabled'} />
              <p
                className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : ''}`}
              >
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
