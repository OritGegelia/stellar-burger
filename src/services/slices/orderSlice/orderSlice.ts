import {
  orderBurgerApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../../utils/burger-api';
import { PayloadAction, createSlice, isAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';

// Get feed

export const getFeed = createAsyncThunk('order/getFeed', async () => {
  const res = await getFeedsApi();
  return res;
});

// Get current order

export const getCurrentOrder = createAsyncThunk(
  'order/getOrder',
  async (number: any) => {
    const res = await getOrderByNumberApi(number);
    return res.orders;
  }
);

// Get user orders

export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async () => {
    const res = await getOrdersApi();
    return res;
  }
);

// Set order

export const setOrder = createAsyncThunk(
  'order/order',
  async (orderIngredients: string[]) => {
    const res = await orderBurgerApi(orderIngredients);
    return res.order;
  }
);

type TInitialState = {
  currentOrder?: TOrder | null;
  order?: TOrder | null;
  orders?: TOrder[];
  feed?: TOrder[];
  total: number;
  totalToday: number;
  orderId: string;
  error: string | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  orderModalData?: TOrder | null;
  orderRequest?: boolean;
  selectedOrder: string | null;
};

export const initialState: TInitialState = {
  currentOrder: null,
  order: null,
  orders: [],
  feed: [],
  total: 0,
  totalToday: 0,
  orderId: '',
  error: undefined,
  status: 'idle',
  orderModalData: null,
  orderRequest: false,
  selectedOrder: null
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
    selectOrders: (state) => state.orders ?? [], // заказы пользователя
    selectFeed: (state) => state.feed ?? [], // все заказы в ленте
    selectTotal: (state) => state.total, // всего заказов
    selectTotalToday: (state) => state.totalToday, //заказов сегодня
    selectCurrentOrder: (state) => state.currentOrder, // выбранный заказ
    selectFeedStatus: (state) => state.status, // статус
    selectOrderModalData: (state) => state.orderModalData // данные для модалки
  },
  extraReducers: (builder) => {
    builder
      .addCase(setOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
        state.orderModalData = action.payload;
      })
      .addCase(setOrder.pending, (state) => {
        state.status = 'failed';
        state.orderRequest = true;
      })
      .addCase(setOrder.rejected, (state, action) => {
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
      })
      .addCase(getUserOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getFeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  selectOrders,
  selectFeed,
  selectCurrentOrder,
  selectFeedStatus,
  selectOrderModalData,
  selectTotal,
  selectTotalToday
} = orderSlice.selectors;

export const { setOrderModalData } = orderSlice.actions;

export default orderSlice.reducer;
