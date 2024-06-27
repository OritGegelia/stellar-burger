import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

interface InitialState {
  ingredients: TIngredient[];
  isLoading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
  selectedIngredientId: string | null;
}

const initialState: InitialState = {
  ingredients: [],
  isLoading: true,
  status: 'idle',
  error: '',
  selectedIngredientId: null
};

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredient(state, action: PayloadAction<string>) {
      state.selectedIngredientId = action.payload;
    }
  },
  selectors: {
    selectIngredient: (state, id: string) => {
      state.ingredients.find((ingredient) => ingredient._id === id);
    },
    selectAllIngredients: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Unfamiliar error';
      });
  }
});

export const { selectAllIngredients, selectIngredient } =
  ingredientSlice.selectors;
export const { setIngredient } = ingredientSlice.actions;
export default ingredientSlice.reducer;
