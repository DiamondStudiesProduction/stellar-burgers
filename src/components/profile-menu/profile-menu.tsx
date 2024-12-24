import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/services/store';
import { logoutApiThunk } from '../../services/slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const { isLoading } = useSelector((store: RootState) => store.user);
  const dispatch: AppDispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutApiThunk());
  };
  if (isLoading.logoutLoading) {
    return <Preloader />;
  }
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
