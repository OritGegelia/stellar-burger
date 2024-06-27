import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getAuthChecked } from '../../services/slices/userSlice';
import { cleanConstructorItems } from '../../services/slices/constructorSlice';
import {
  order,
  selectOrderModalData,
  setOrderModalData
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(getAuthChecked);
  const constructorItems = useSelector(
    (state: RootState) => state.burgerPuzzle.constructorItems
  );

  const orderRequest = useSelector(
    (state: RootState) => state.order.status === 'loading'
  );

  const orderModalData = useSelector(selectOrderModalData) || null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login');
    } else {
      const ids = [
        constructorItems.bun._id!,
        ...constructorItems.ingredients.map((a) => a._id),
        constructorItems.bun._id!
      ];
      dispatch(order(ids));
    }
  };

  const closeOrderModal = () => {
    dispatch(cleanConstructorItems());
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),

    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
