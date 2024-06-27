import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { fetchIngredients } from '../../services/slices/ingredientSlice';
import { AppDispatch, RootState } from 'src/services/store';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { ingredients, status, error } = useSelector(
    (state: RootState) => state.ingredients
  );
  const buns = ingredients.filter(
    (ingredient: TIngredient) => ingredient.type === 'bun'
  );
  const mains = ingredients.filter(
    (ingredient: TIngredient) => ingredient.type === 'main'
  );
  const sauces = ingredients.filter(
    (ingredient: TIngredient) => ingredient.type === 'sauce'
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [status, dispatch]);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
