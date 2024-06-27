import { FC, useEffect } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

const getTotal = (orders: TOrder[]): number =>
  orders.filter((order) => order.status === 'done').length;

const getTotalToday = (orders: TOrder[]): number => {
  const today = new Date().toISOString().split('T')[0];
  return orders.filter(
    (order) =>
      order.status === 'done' && order.createdAt.split('T')[0] === today
  ).length;
};

export const FeedInfo: FC = () => {
  const orders = useSelector((state: RootState) => state.feed.orders || []);
  const feed = {
    total: getTotal(orders),
    totalToday: getTotalToday(orders)
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
