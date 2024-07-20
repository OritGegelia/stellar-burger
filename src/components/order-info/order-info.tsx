import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectAllIngredients } from '../../services/slices/ingredientSlice';
import {
  getCurrentOrder,
  selectCurrentOrder
} from '../../services/slices/orderSlice';

// TODO

export const OrderInfo: React.FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (number) {
      dispatch(getCurrentOrder(Number(number)));
    }
  }, [dispatch, number]);

  const orderData = useSelector(selectCurrentOrder);

  const ingredients: TIngredient[] = useSelector(selectAllIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
