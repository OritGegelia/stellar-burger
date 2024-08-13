import { configureStore } from '@reduxjs/toolkit';
import ingredientReducer, {
  fetchIngredients,
  setIngredient
} from './ingredientSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'e5e2ae2b4248c744cff2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: 'e720e1411651dc383e96',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

describe('ingredient slice reducers', () => {
  let store: any;

  // Инициализация магазина перед каждым тестом
  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientReducer
      }
    });
  });

  // Тест для редьюсера setIngredient

  it('Тест для редьюсера setIngredient', () => {
    store.dispatch(setIngredient(mockIngredients[0]._id));
    const state = store.getState().ingredients;
    expect(state.selectedIngredientId).toBe(mockIngredients[0]._id);
  });

  // Тест для fetchIngredients.pending

  it('Тест для fetchIngredients.pending', () => {
    store.dispatch(fetchIngredients.pending('', undefined));
    const state = store.getState().ingredients;
    expect(state.status).toBe('loading');
    expect(state.isLoading).toBe(true);
  });

  // Тест для fetchIngredients.fulfilled

  it('Тест для fetchIngredients.fulfilled', () => {
    store.dispatch(fetchIngredients.fulfilled(mockIngredients, '', undefined));
    const state = store.getState().ingredients;
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.status).toBe('succeeded');
    expect(state.isLoading).toBe(false);
  });

  // Тест для fetchIngredients.rejected

  it('Тест для fetchIngredients.rejected', () => {
    const error = new Error('Network Error');
    store.dispatch(fetchIngredients.rejected(error, '', undefined));
    const state = store.getState().ingredients;
    expect(state.status).toBe('failed');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network Error');
  });
});
