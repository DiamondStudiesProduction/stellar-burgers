import {
  fetchWithRefresh,
  forgotPasswordApi,
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient, TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../src/utils/cookie';

export const getBurgerIngredientsThunk = createAsyncThunk(
  'BurgerIngredients/getBurgerIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

export const registrUserThunk = createAsyncThunk(
  'user/registrUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (!response?.success) {
      return;
    }
    const expiresInDays = 7;
    const expires = new Date();
    expires.setDate(expires.getDate() + expiresInDays);
    setCookie('accessToken', response.accessToken, {
      expires,
      sameSite: 'Lax',
      secure: true
    });
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const getUserApiThunk = createAsyncThunk('user/getUserApi', async () => {
  const response = await getUserApi();
  return response;
});

type fetchWithRefreshThunkResponse = {
  success: boolean;
  user: TUser;
};

export const fetchWithRefreshThunk = createAsyncThunk(
  'user/userFetchWithRefresh',
  async () => {
    const response = await fetchWithRefresh(
      'https://norma.nomoreparties.space/api/auth/user',
      {
        headers: {
          authorization: getCookie('accessToken')
        } as HeadersInit
      }
    );
    return response as fetchWithRefreshThunkResponse;
  }
);

export const logoutApiThunk = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi().then(() => {
    localStorage.clear();
    deleteCookie('accessToken');
  });
  return response;
});

export const loginUserApiThunk = createAsyncThunk(
  'user/Login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data).then((res) => {
      const expiresInDays = 7;
      const expires = new Date();
      expires.setDate(expires.getDate() + expiresInDays);
      setCookie('accessToken', res.accessToken, {
        expires,
        sameSite: 'Lax',
        secure: true
      });
      localStorage.setItem('refreshToken', res.refreshToken);
      return res;
    });
    return response;
  }
);

interface userApi {
  name: string;
  email: string;
  password: string;
}

export const updateUserApiThunk = createAsyncThunk(
  'user/updateUserApi',
  async (data: userApi) => {
    const response = await updateUserApi(data);
    return response;
  }
);

export const orderBurgerApiThunk = createAsyncThunk(
  'orderBurger/orderBurgerApi',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

export const getOrdersApiThunk = createAsyncThunk(
  'user/getOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const forgotPasswordApiThunk = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

export const getFeedsApiThunk = createAsyncThunk('feeds/getFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const getOrderByNumberApiThunk = createAsyncThunk(
  'order/getOrderByNumber',
  async (data: number) => {
    const response = await getOrderByNumberApi(data);
    return response;
  }
);

interface BurgerIngredientsState {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  ingredients: TIngredient[];
  ingredient: TIngredient | null;
  isLoading: boolean;
  error: null | string | object;
}

export interface ConstructorItemsState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TIngredient[];
  };
}

export interface UserState {
  user: TUser | any;
  isLoading: {
    isAuthLoading: boolean;
    logoutLoading: boolean;
    loginLoading: boolean;
    registerLoading: boolean;
    getUserLoading: boolean;
    updateUserLoading: boolean;
  };
}

interface OrderBurger {
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

interface Orders {
  ordersFeed: TOrder[];
  ordersHistory: TOrder[];
  feed: {};
  orderData: TOrder | null;
  isLoading: {
    feedsLoading: boolean;
    ordersLoading: boolean;
    orderByNumber: boolean;
  };
}

const initialState: {
  burgerIngredients: BurgerIngredientsState;
  constructorItemsState: ConstructorItemsState;
  user: UserState;
  orderBurger: OrderBurger;
  orders: Orders;
} = {
  burgerIngredients: {
    buns: [],
    mains: [],
    sauces: [],
    ingredients: [],
    ingredient: null,
    isLoading: false,
    error: null
  },
  constructorItemsState: {
    constructorItems: {
      bun: null,
      ingredients: []
    }
  },
  user: {
    user: null,
    isLoading: {
      isAuthLoading: false,
      logoutLoading: false,
      loginLoading: false,
      registerLoading: false,
      getUserLoading: false,
      updateUserLoading: false
    }
  },
  orderBurger: { orderRequest: false, orderModalData: null },
  orders: {
    ordersFeed: [],
    ordersHistory: [],
    feed: {},
    isLoading: {
      feedsLoading: false,
      ordersLoading: false,
      orderByNumber: false
    },
    orderData: null
  }
};

export const burgerIngredientsSlice = createSlice({
  name: 'BurgerIngredients',
  initialState: initialState.burgerIngredients,
  reducers: {
    findIngredient: (state, action) => {
      state.ingredient = state.ingredients.find(
        (item) => item._id === action.payload
      ) as TIngredient;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBurgerIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBurgerIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки ингредиентов';
      })
      .addCase(getBurgerIngredientsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buns = action.payload.filter((item) => item.type === 'bun');
        state.mains = action.payload.filter((item) => item.type === 'main');
        state.sauces = action.payload.filter((item) => item.type === 'sauce');
        state.ingredients = action.payload;
      });
  }
});

export const constructorItemsSlice = createSlice({
  name: 'constructorItemsState',
  initialState: initialState.constructorItemsState,
  reducers: {
    addIngredient: (state, action) => {
      state.constructorItems.ingredients = [
        ...state.constructorItems.ingredients,
        ...action.payload
      ];
    },
    deleteIngredient: (state, action) => {
      const newArray = state.constructorItems.ingredients.filter(
        (_, index) => index !== action.payload
      );
      state.constructorItems.ingredients = newArray;
    },
    deleteAll: (state) => {
      state.constructorItems.ingredients = [];
    },
    addBun: (state, action) => {
      state.constructorItems.bun = action.payload;
    },
    moveUpIngredient: (state, action) => {
      const index = action.payload;
      const newIngredients = [...state.constructorItems.ingredients];
      [newIngredients[index], newIngredients[index - 1]] = [
        newIngredients[index - 1],
        newIngredients[index]
      ];
      state.constructorItems.ingredients = newIngredients;
    },
    moveDownIngredient: (state, action) => {
      const index = action.payload;
      const newIngredients = [...state.constructorItems.ingredients];
      [newIngredients[index], newIngredients[index + 1]] = [
        newIngredients[index + 1],
        newIngredients[index]
      ];
      state.constructorItems.ingredients = newIngredients;
    }
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState.user,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registrUserThunk.pending, (state) => {
        state.isLoading.registerLoading = true;
      })
      .addCase(registrUserThunk.rejected, (state) => {
        state.isLoading.registerLoading = false;
      })
      .addCase(registrUserThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user;
        state.isLoading.registerLoading = false;
      })
      .addCase(getUserApiThunk.pending, (state) => {
        state.isLoading.getUserLoading = true;
      })
      .addCase(getUserApiThunk.rejected, (state) => {
        state.isLoading.getUserLoading = false;
      })
      .addCase(getUserApiThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading.getUserLoading = false;
      })
      .addCase(fetchWithRefreshThunk.pending, (state) => {
        state.isLoading.isAuthLoading = true;
      })
      .addCase(fetchWithRefreshThunk.rejected, (state) => {
        state.isLoading.isAuthLoading = false;
      })
      .addCase(fetchWithRefreshThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading.isAuthLoading = false;
      })
      .addCase(logoutApiThunk.pending, (state) => {
        state.isLoading.logoutLoading = true;
      })
      .addCase(logoutApiThunk.rejected, (state) => {
        state.isLoading.logoutLoading = false;
      })
      .addCase(logoutApiThunk.fulfilled, (state) => {
        state.user = null;
        state.isLoading.logoutLoading = false;
      })
      .addCase(loginUserApiThunk.pending, (state) => {
        state.isLoading.loginLoading = true;
      })
      .addCase(loginUserApiThunk.rejected, (state) => {
        state.isLoading.loginLoading = false;
      })
      .addCase(loginUserApiThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading.loginLoading = false;
      })
      .addCase(updateUserApiThunk.pending, (state) => {
        state.isLoading.updateUserLoading = true;
      })
      .addCase(updateUserApiThunk.rejected, (state) => {
        state.isLoading.updateUserLoading = false;
      })
      .addCase(updateUserApiThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading.updateUserLoading = false;
      });
  }
});

export const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState: initialState.orderBurger,
  reducers: {
    orderModalDataIsNull: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerApiThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurgerApiThunk.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurgerApiThunk.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      });
  }
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialState.orders,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsApiThunk.pending, (state) => {
        state.isLoading.feedsLoading = true;
      })
      .addCase(getFeedsApiThunk.rejected, (state) => {
        state.isLoading.feedsLoading = false;
      })
      .addCase(getFeedsApiThunk.fulfilled, (state, action) => {
        state.ordersFeed = action.payload.orders;
        state.feed = action.payload;
        state.isLoading.feedsLoading = false;
      })
      .addCase(getOrdersApiThunk.pending, (state) => {
        state.isLoading.ordersLoading = true;
      })
      .addCase(getOrdersApiThunk.rejected, (state) => {
        state.isLoading.ordersLoading = false;
      })
      .addCase(getOrdersApiThunk.fulfilled, (state, action) => {
        state.ordersHistory = action.payload;
        state.isLoading.ordersLoading = false;
      })
      .addCase(getOrderByNumberApiThunk.pending, (state) => {
        state.isLoading.orderByNumber = true;
      })
      .addCase(getOrderByNumberApiThunk.rejected, (state) => {
        state.isLoading.orderByNumber = false;
      })
      .addCase(getOrderByNumberApiThunk.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0] || null;
        state.isLoading.orderByNumber = false;
      });
  }
});

export const burgerIngredientsReducer = burgerIngredientsSlice.reducer;
export const constructorItemsReducer = constructorItemsSlice.reducer;
export const userReducer = userSlice.reducer;
export const orderBurgerReducer = orderBurgerSlice.reducer;
export const orderFeedReducer = ordersSlice.reducer;
export const {
  addIngredient,
  addBun,
  deleteIngredient,
  deleteAll,
  moveUpIngredient,
  moveDownIngredient
} = constructorItemsSlice.actions;
export const { findIngredient } = burgerIngredientsSlice.actions;
export const { orderModalDataIsNull } = orderBurgerSlice.actions;
