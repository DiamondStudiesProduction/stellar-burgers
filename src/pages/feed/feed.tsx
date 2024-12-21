import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedsApiThunk } from '../../services/slice';
import { AppDispatch, RootState } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const { ordersFeed, isLoading } = useSelector(
    (store: RootState) => store.orders
  );
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedsApiThunk());
  }, [dispatch]);

  return isLoading.feedsLoading || !ordersFeed.length ? (
    <Preloader />
  ) : (
    <FeedUI
      orders={ordersFeed}
      handleGetFeeds={() => dispatch(getFeedsApiThunk())}
    />
  );
};
