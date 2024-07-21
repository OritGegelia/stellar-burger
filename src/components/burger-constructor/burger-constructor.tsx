import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getAuthChecked, getUser } from '../../services/slices/userSlice';
import { cleanConstructorItems } from '../../services/slices/constructorSlice/constructorSlice';
import {
  selectOrderModalData,
  setOrderModalData,
  setOrder,
  selectFeedStatus
} from '../../services/slices/orderSlice';

// TODO

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(getUser);
  const constructorItems = useSelector(
    (state: RootState) => state.burgerPuzzle.constructorItems
  );

  const orderRequest = useSelector(
    (state: RootState) => selectFeedStatus(state) === 'loading'
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
      dispatch(setOrder(ids));
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
