import { PayloadAction, createSlice, isAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

//  Get orders

export const getMyOrders = createAsyncThunk('order/getOrders', async () => {
  const res = await getOrdersApi();
  return res;
});

type TInitialState = {
  status: 'succeeded' | 'failed' | 'idle' | 'loading';
  orders: TOrder[] | null;
  error: string | undefined;
  selectedOrder: string | null;
};
const initialState: TInitialState = {
  status: 'idle',
  orders: [],
  error: '',
  selectedOrder: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<string>) => {
      state.selectedOrder = action.payload;
    }
  },
  selectors: {
    setAllOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setAllOrders } = feedSlice.selectors;
export const { setOrder } = feedSlice.actions;
export default feedSlice.reducer;
