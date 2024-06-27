import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getMyOrders } from '../../services/slices/feedSlice';
import { RootState } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getMyOrders());
  };

  const orders = useSelector((state: RootState) => state.feed.orders || []);
  const status = useSelector((state: RootState) => state.feed.status);

  if (status === 'loading') {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
