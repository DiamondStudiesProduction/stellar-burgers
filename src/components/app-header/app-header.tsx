import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';

export const AppHeader: FC = () => {
  const { user } = useSelector((store: RootState) => store.user);
  return <AppHeaderUI userName={user?.name} />;
};
