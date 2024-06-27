import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export interface IBurgerConstructorSliceState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderModalData: TOrder | null;
}

const initialState: IBurgerConstructorSliceState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderModalData: null
};

const constructorSlice = createSlice({
  name: 'burgerPuzzle',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const newIngredient = {
        ...action.payload,
        id: uuidv4()
      };
      state.constructorItems.ingredients.push(newIngredient);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    changeIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = {
          ...action.payload,
          id: uuidv4()
        };
      }
    },
    cleanConstructorItems(state) {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  changeIngredient,
  cleanConstructorItems
} = constructorSlice.actions;
export default constructorSlice.reducer;
