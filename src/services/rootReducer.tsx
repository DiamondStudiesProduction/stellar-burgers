import { combineReducers } from '@reduxjs/toolkit';
import {
  burgerIngredientsReducer,
  constructorItemsReducer,
  orderBurgerReducer,
  orderFeedReducer,
  userReducer
} from './slice';
const rootReducer = combineReducers({
  BurgerIngredients: burgerIngredientsReducer,
  ConstructorItems: constructorItemsReducer,
  user: userReducer,
  orderBurger: orderBurgerReducer,
  orders: orderFeedReducer
});

export default rootReducer;
