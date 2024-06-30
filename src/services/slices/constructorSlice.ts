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
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: uuidv4()
          }
        };
      }
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
    },
    upIngredient: (state, action: PayloadAction<string>) => {
      for (let i = 1; i < state.constructorItems.ingredients.length; i++)
        if (state.constructorItems.ingredients[i].id === action.payload) {
          const temp = state.constructorItems.ingredients[i - 1];
          state.constructorItems.ingredients[i - 1] =
            state.constructorItems.ingredients[i];
          state.constructorItems.ingredients[i] = temp;
          break;
        }
    },
    downIngredient: (state, action: PayloadAction<string>) => {
      for (let i = 0; i < state.constructorItems.ingredients.length - 1; i++)
        if (state.constructorItems.ingredients[i].id === action.payload) {
          const temp = state.constructorItems.ingredients[i + 1];
          state.constructorItems.ingredients[i + 1] =
            state.constructorItems.ingredients[i];
          state.constructorItems.ingredients[i] = temp;
          break;
        }
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  changeIngredient,
  cleanConstructorItems,
  upIngredient,
  downIngredient
} = constructorSlice.actions;
export default constructorSlice.reducer;
