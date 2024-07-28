import { combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from '../slices/ingredientSlice/ingredientSlice';
import constructorReducer from '../slices/constructorSlice/constructorSlice';
import userReducer from '../slices/userSlice/userSlice';
import orderReducer from '../slices/orderSlice/orderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  burgerPuzzle: constructorReducer,
  user: userReducer,
  order: orderReducer
});

export default rootReducer;
