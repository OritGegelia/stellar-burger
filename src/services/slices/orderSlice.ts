import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { stat } from 'fs/promises';

// Set order

export const order = createAsyncThunk(
  'order/order',
  async (orderIngredients: string[]) => {
    try {
      const res = await orderBurgerApi(orderIngredients);
      console.log(`hi`);
      return res.order;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// Get current order

export const getCurrentOrder = createAsyncThunk(
  'order/getOrder',
  async (number: any) => {
    try {
      const res = await getOrderByNumberApi(number);
      return res.orders;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

type TOrderState = {
  currentOrder?: TOrder | null;
  order?: TOrder | null;
  orders?: TOrder[] | null;
  orderId: string;
  error: string | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  orderModalData?: TOrder | null;
  orderRequest?: boolean;
};

const initialState: TOrderState = {
  currentOrder: null,
  order: null,
  orders: null,
  orderId: '',
  error: undefined,
  status: 'idle',
  orderModalData: null,
  orderRequest: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    }
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(order.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
        state.orderModalData = action.payload;
      })
      .addCase(order.pending, (state) => {
        state.status = 'failed';
        state.orderRequest = true;
      })
      .addCase(order.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.orderRequest = false;
      })
      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload[0];
      })
      .addCase(getCurrentOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setOrderModalData } = orderSlice.actions;
export const { selectOrderModalData } = orderSlice.selectors;
export default orderSlice.reducer;
