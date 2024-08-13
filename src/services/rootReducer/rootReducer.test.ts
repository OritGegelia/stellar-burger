import rootReducer from './rootReducer';
import { RootState } from '../store';
import { initialState as ingredientInitialState } from '../slices/ingredientSlice/ingredientSlice';
import { initialState as userInitialState } from '../slices/userSlice/userSlice';
import { initialState as orderInitialState } from '../slices/orderSlice/orderSlice';
import { initialState as constructorInitialState } from '../slices/constructorSlice/constructorSlice';

export const initialStates = {
  ingredients: ingredientInitialState,
  burgerPuzzle: constructorInitialState,
  user: userInitialState,
  order: orderInitialState
};

describe('rootReducer', () => {
  it('Тест rootReducer - инициализация с данными по умолчанию', () => {
    const action = { type: '@@INIT' };
    const state: RootState = rootReducer(undefined, action);
    expect(state).toEqual(initialStates);
  });
});
