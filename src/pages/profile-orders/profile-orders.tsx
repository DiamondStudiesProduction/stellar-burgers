import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { getOrdersApiThunk } from '../../services/slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const { ordersHistory, isLoading } = useSelector(
    (store: RootState) => store.orders
  );
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersApiThunk());
  }, [dispatch]);

  return isLoading.ordersLoading ? (
    <Preloader />
  ) : (
    <ProfileOrdersUI orders={ordersHistory} />
  );
};
