import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { getMyOrders } from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const orders = useSelector((state: RootState) => state.feed.orders || []);

  return <ProfileOrdersUI orders={orders} />;
};
