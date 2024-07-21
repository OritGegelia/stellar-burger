import { configureStore } from '@reduxjs/toolkit';
import ingredientReducer, { fetchIngredients, initialState, setIngredient } from './ingredientSlice';
import { getIngredientsApi } from '../../../utils/burger-api';

jest.mock('../../../utils/burger-api'); // Отключаем реальный API

describe('ingredientSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientReducer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle setIngredient', () => {
    const ingredientId = '12345';
    store.dispatch(setIngredient(ingredientId));
    const state = store.getState().ingredients;
    expect(state.selectedIngredientId).toBe(ingredientId);
  });

  describe('fetchIngredients', () => {
    it('should handle pending state', async () => {
      const action = fetchIngredients.pending('1', 'fetchIngredients');

      const state = ingredientReducer(initialState, action);
      expect(state.status).toBe('loading');
      expect(state.isLoading).toBe(true);
    });

    it('should handle fulfilled state', async () => {
      const mockIngredients = [{ _id: '1', name: 'Ingredient 1' }, { _id: '2', name: 'Ingredient 2' }];
      (getIngredientsApi as jest.Mock).mockResolvedValueOnce(mockIngredients); // Задаем значение, возвращаемое из API

      const action = fetchIngredients.fulfilled(mockIngredients, '1', undefined);
      const state = ingredientReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.status).toBe('succeeded');
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('should handle rejected state', async () => {
      const errorMessage = 'Network error';
      const action = fetchIngredients.rejected({ error: { message: errorMessage } }, '1', undefined);
      const state = ingredientReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});