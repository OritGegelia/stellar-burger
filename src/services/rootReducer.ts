import { combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from './slices/ingredientSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';

const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  burgerPuzzle: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer
});

export default rootReducer;
