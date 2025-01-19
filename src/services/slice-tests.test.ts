import { TConstructorIngredient, TOrder } from '@utils-types';
import {
  addIngredient,
  burgerIngredientsReducer,
  constructorItemsReducer,
  deleteIngredient,
  getBurgerIngredientsThunk,
  getFeedsApiThunk,
  getOrderByNumberApiThunk,
  getOrdersApiThunk,
  getUserApiThunk,
  loginUserApiThunk,
  logoutApiThunk,
  moveDownIngredient,
  moveUpIngredient,
  orderBurgerApiThunk,
  orderBurgerReducer,
  orderFeedReducer,
  registrUserThunk,
  updateUserApiThunk,
  userReducer
} from './slice';
import rootReducer from './rootReducer';
import { TLoginData } from '@api';

describe('rootReducer', () => {
  it('should return the initial state', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    expect(initialState).toEqual({
      BurgerIngredients: expect.any(Object),
      ConstructorItems: expect.any(Object),
      user: expect.any(Object),
      orderBurger: expect.any(Object),
      orders: expect.any(Object)
    });
  });
});

describe('constructor slice', () => {
  const ingredient1: TConstructorIngredient = {
    _id: '1',
    id: '2',
    name: 'соус традиционный',
    type: 'sauce',
    proteins: 10,
    fat: 10,
    carbohydrates: 3,
    calories: 10,
    price: 100,
    image: 'sause.jpg',
    image_large: 'sause_large.jpg',
    image_mobile: 'sause_mobile.jpg'
  };
  const ingredient2: TConstructorIngredient = {
    _id: '2',
    id: '3',
    name: 'соус традиционный',
    type: 'sauce',
    proteins: 15,
    fat: 15,
    carbohydrates: 3,
    calories: 10,
    price: 150,
    image: 'sause.jpg',
    image_large: 'sause_large.jpg',
    image_mobile: 'sause_mobile.jpg'
  };

  it('action-ingredient-add', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };
    const newState = constructorItemsReducer(
      initialState,
      addIngredient([ingredient1])
    );
    expect(newState.constructorItems.ingredients).toEqual([ingredient1]);
  });

  it('action-ingredient-remove', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: [ingredient1]
      }
    };
    const newState = constructorItemsReducer(initialState, deleteIngredient(0));
    expect(newState.constructorItems.ingredients).toEqual([]);
  });

  it('action-ingredient-move-up', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };
    const newState = constructorItemsReducer(initialState, moveUpIngredient(1));
    expect(newState.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient1
    ]);
  });

  it('action-ingredient-move-down', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };
    const newState = constructorItemsReducer(
      initialState,
      moveDownIngredient(0)
    );
    expect(newState.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient1
    ]);
  });
});

describe('orders slice', () => {
  describe('pending handlers', () => {
    it('should set isLoading is true for feedsLoading', () => {
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      };
      const actualState = orderFeedReducer(
        initialState,
        getFeedsApiThunk.pending('')
      );

      expect(actualState).toEqual({
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: true,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      });
    });
    it('should set isLoading is true for ordersLoading', () => {
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      };
      const actualState = orderFeedReducer(
        initialState,
        getOrdersApiThunk.pending('')
      );

      expect(actualState).toEqual({
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: true,
          orderByNumber: false
        },
        orderData: null
      });
    });
    it('should set isLoading is true for orderByNumber', () => {
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      };
      const actualState = orderFeedReducer(
        initialState,
        getOrderByNumberApiThunk.pending('', 0)
      );

      expect(actualState).toEqual({
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: true
        },
        orderData: null
      });
    });
  });
  describe('fulfilled handlers', () => {
    it('(getFeedsApiThunk) should update feed, ordersFeed and make feedLoading is false', () => {
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      };
      const order: TOrder = {
        createdAt: '2025-01-15',
        ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
        name: 'бургер',
        number: 12345,
        status: 'done',
        updatedAt: '2025-01-15',
        _id: '1'
      };
      const feedsResponse = {
        orders: [order],
        success: true,
        total: 65231,
        totalToday: 165
      };
      const actualState = orderFeedReducer(
        initialState,
        getFeedsApiThunk.fulfilled(feedsResponse, '')
      );

      expect(actualState.feed).toEqual(feedsResponse);
      expect(actualState.ordersFeed).toEqual([order]);
      expect(actualState.isLoading.feedsLoading).toBe(false);
    });
    it('(getOrdersApiThunk) should update ordersHistory and make ordersLoading is false', () => {
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      };
      const order: TOrder[] = [
        {
          createdAt: '2025-01-15',
          ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
          name: 'бургер',
          number: 12345,
          status: 'done',
          updatedAt: '2025-01-15',
          _id: '1'
        }
      ];
      const actualState = orderFeedReducer(
        initialState,
        getOrdersApiThunk.fulfilled(order, '')
      );
      expect(actualState.ordersHistory).toEqual(order);
      expect(actualState.isLoading.ordersLoading).toBe(false);
    });
    it('(getOrderByNumberApiThunk) should update orderData and make isLoading.orderByNumber is false', () => {
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      };
      const order = {
        0: {
          createdAt: '2025-01-16',
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
          name: 'burger',
          number: 33333,
          owner: '6788f2c2133acd001be4a956',
          status: 'done',
          updatedAt: '2025-01-16',
          __v: 0,
          _id: '6788f2cd133acd001be4a958'
        }
      };
      const orderDataResponse = {
        success: true,
        orders: [order[0]]
      };

      const actualState = orderFeedReducer(
        initialState,
        getOrderByNumberApiThunk.fulfilled(orderDataResponse, '', 1)
      );
      expect(actualState.orderData).toEqual(order[0]);
      expect(actualState.isLoading.orderByNumber).toBe(false);
    });
  });
  describe('rejected handlers', () => {
    it('should set isLoading is false for feedsLoading', () => {
      const error = new Error('Some error message');
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: true,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      };
      const actualState = orderFeedReducer(
        initialState,
        getFeedsApiThunk.rejected(error, '')
      );

      expect(actualState).toEqual({
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      });
    });
    it('should set isLoading is false for feedsLoading', () => {
      const error = new Error('Some error message');
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: true,
          orderByNumber: false
        },
        orderData: null
      };
      const actualState = orderFeedReducer(
        initialState,
        getOrdersApiThunk.rejected(error, '')
      );

      expect(actualState).toEqual({
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      });
    });
    it('should set isLoading is false for feedsLoading', () => {
      const error = new Error('Some error message');
      const initialState = {
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: true
        },
        orderData: null
      };
      const actualState = orderFeedReducer(
        initialState,
        getOrderByNumberApiThunk.rejected(error, '', 0)
      );

      expect(actualState).toEqual({
        ordersFeed: [],
        ordersHistory: [],
        feed: {},
        isLoading: {
          feedsLoading: false,
          ordersLoading: false,
          orderByNumber: false
        },
        orderData: null
      });
    });
  });
});

describe('orderBurger slice', () => {
  describe('pending handler', () => {
    it('(orderBurgerApiThunk) should set isLoading is true for orderBurger', () => {
      const initialState = { orderRequest: false, orderModalData: null };
      const actualState = orderBurgerReducer(
        initialState,
        orderBurgerApiThunk.pending('', [])
      );

      expect(actualState).toEqual({ orderRequest: true, orderModalData: null });
    });
  });
  describe('fulfilled handler', () => {
    it('(orderBurgerResponse) should set orderRequest is false and make update for orderModalData', () => {
      const initialState = { orderRequest: true, orderModalData: null };
      const order = {
        createdAt: '2025-01-15',
        ingredients: [],
        name: 'бургер',
        number: 12345,
        owner: {
          createdAt: '2025-01-15',
          email: 'email@mail.ru',
          name: 'name',
          updatedAt: '2025-01-15'
        },
        price: 1,
        status: 'done',
        updatedAt: '2025-01-15',
        _id: '1'
      };
      const orderBurgerResponse = {
        success: true,
        order: order,
        name: 'burger'
      };
      const actualState = orderBurgerReducer(
        initialState,
        orderBurgerApiThunk.fulfilled(orderBurgerResponse, '', [])
      );

      expect(actualState).toEqual({
        orderRequest: false,
        orderModalData: order
      });
    });
  });
  describe('rejected handler', () => {
    it('(orderBurgerApiThunk) should set orderRequest is false for orderBurger', () => {
      const initialState = { orderRequest: true, orderModalData: null };
      const error = new Error('Some error message');
      const actualState = orderBurgerReducer(
        initialState,
        orderBurgerApiThunk.rejected(error, '', [])
      );

      expect(actualState).toEqual({
        orderRequest: false,
        orderModalData: null
      });
    });
  });
});

describe('user slice', () => {
  describe('pending handler', () => {
    it('(registrUserThunk) should set registerLoading is true for user', () => {
      const initialState = {
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const registerData = {
        email: 'email',
        name: 'name',
        password: 'password'
      };
      const actualState = userReducer(
        initialState,
        registrUserThunk.pending('', registerData)
      );
      expect(actualState).toEqual({
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: true,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(getUserApiThunk) should set getUserLoading is true for user', () => {
      const initialState = {
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const actualState = userReducer(
        initialState,
        getUserApiThunk.pending('')
      );
      expect(actualState).toEqual({
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: true,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(logoutApiThunk) should set logoutLoading is true for user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const actualState = userReducer(initialState, logoutApiThunk.pending(''));
      expect(actualState).toEqual({
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: true,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(loginUserApiThunk) should set loginLoading is true for user', () => {
      const initialState = {
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: false
      };
      const loginDataResponse: TLoginData = {
        email: 'email',
        password: 'password'
      };
      const actualState = userReducer(
        initialState,
        loginUserApiThunk.pending('', loginDataResponse)
      );
      expect(actualState.isLoading.loginLoading).toBe(true);
    });
    it('(updateUserApiThunk) should set updateUserLoading is true for user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const updateDataResponse = {
        name: 'vlad',
        email: 'email@mail.ru',
        password: '12345'
      };
      const actualState = userReducer(
        initialState,
        updateUserApiThunk.pending('', updateDataResponse)
      );
      expect(actualState).toEqual({
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: true
        },
        userCheck: true
      });
    });
  });

  describe('fulfilled handler', () => {
    it('(registrUserThunk) should set registerLoading is false and update user', () => {
      const initialState = {
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: true,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const registerData = {
        email: 'email',
        name: 'name',
        password: 'password'
      };
      const registerDataResolve = {
        accessToken:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODkzMjAzMTMzYWNkMDAxYmU0YWE0YiIsImlhdCI6MTczNzA0NDQ4MywiZXhwIjoxNzM3MDQ1NjgzfQ.zvogAd13SoSxKA4q-DRS5qm_WSEmBupoplJCSPipTPw',
        refreshToken:
          '25cd7f28d2bd31f623a01628dc021559c8f430da0256a856af1a906a9f8698b714d5d44ba530fe02',
        success: true,
        user: {
          email: 'email',
          name: 'name'
        }
      };
      const actualState = userReducer(
        initialState,
        registrUserThunk.fulfilled(registerDataResolve, '', registerData)
      );
      expect(actualState).toEqual({
        user: {
          email: 'email',
          name: 'name'
        },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(getUserApiThunk) should set getUserLoading is false, update user and set userCheck is true', () => {
      const initialState = {
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: true,
          updateUserLoading: false
        },
        userCheck: true
      };
      const dataResponse = {
        success: true,
        user: {
          email: 'email',
          name: 'name'
        }
      };
      const actualState = userReducer(
        initialState,
        getUserApiThunk.fulfilled(dataResponse, '')
      );
      expect(actualState).toEqual({
        user: {
          email: 'email',
          name: 'name'
        },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(logoutApiThunk) should set logoutLoading is false and update user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: true,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const dataResponse = {
        success: true,
        user: {
          email: 'email',
          name: 'name'
        }
      };
      const actualState = userReducer(
        initialState,
        logoutApiThunk.fulfilled(undefined, '')
      );
      expect(actualState).toEqual({
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(loginUserApiThunk) should set loginLoading is false and update user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: true,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const loginDataResolve = {
        accessToken:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODkzMjAzMTMzYWNkMDAxYmU0YWE0YiIsImlhdCI6MTczNzA0NDQ4MywiZXhwIjoxNzM3MDQ1NjgzfQ.zvogAd13SoSxKA4q-DRS5qm_WSEmBupoplJCSPipTPw',
        refreshToken:
          '25cd7f28d2bd31f623a01628dc021559c8f430da0256a856af1a906a9f8698b714d5d44ba530fe02',
        success: true,
        user: {
          email: 'email',
          name: 'name'
        }
      };
      const loginDataResponse: TLoginData = {
        email: 'email',
        password: 'password'
      };
      const actualState = userReducer(
        initialState,
        loginUserApiThunk.fulfilled(loginDataResolve, '', loginDataResponse)
      );
      expect(actualState).toEqual({
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(updateUserApiThunk) should set updateUserLoading is false and update user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: true
        },
        userCheck: true
      };
      const updateUserResponse = {
        success: true,
        user: {
          email: 'email@mail.ru',
          name: 'vlad'
        }
      };
      const userApiResponse = {
        name: 'name',
        email: 'email',
        password: '12345'
      };
      const actualState = userReducer(
        initialState,
        updateUserApiThunk.fulfilled(updateUserResponse, '', userApiResponse)
      );
      expect(actualState).toEqual({
        user: { email: 'email@mail.ru', name: 'vlad' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
  });

  describe('rejected handler', () => {
    it('(registrUserThunk) should set registerLoading is false for user', () => {
      const initialState = {
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: true,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const registerData = {
        email: 'email',
        name: 'name',
        password: 'password'
      };
      const error = new Error('Some error message');
      const actualState = userReducer(
        initialState,
        registrUserThunk.rejected(error, '', registerData)
      );
      expect(actualState).toEqual({
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(getUserApiThunk) should set getUserLoading is false for user', () => {
      const initialState = {
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: true,
          updateUserLoading: false
        },
        userCheck: true
      };
      const error = new Error('Some error message');
      const actualState = userReducer(
        initialState,
        getUserApiThunk.rejected(error, '')
      );
      expect(actualState.isLoading.getUserLoading).toBe(false);
      expect(actualState).toEqual({
        user: null,
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(logoutApiThunk) should set logoutLoading is false for user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: true,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const error = new Error('Some error message');
      const actualState = userReducer(
        initialState,
        logoutApiThunk.rejected(error, '')
      );
      expect(actualState).toEqual({
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(loginUserApiThunk) should set loginLoading is false for user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: true,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      };
      const error = new Error('Some error message');
      const loginData: TLoginData = {
        email: 'email',
        password: 'password'
      };
      const actualState = userReducer(
        initialState,
        loginUserApiThunk.rejected(error, '', loginData)
      );
      expect(actualState).toEqual({
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
    it('(updateUserApiThunk) should set updateUserLoading is false for user', () => {
      const initialState = {
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: true
        },
        userCheck: true
      };
      const error = new Error('Some error message');
      const userApiResponse = {
        name: 'name',
        email: 'email',
        password: '12345'
      };
      const actualState = userReducer(
        initialState,
        updateUserApiThunk.rejected(error, '', userApiResponse)
      );
      expect(actualState).toEqual({
        user: { email: 'email', name: 'name' },
        isLoading: {
          isAuthLoading: false,
          logoutLoading: false,
          loginLoading: false,
          registerLoading: false,
          getUserLoading: false,
          updateUserLoading: false
        },
        userCheck: true
      });
    });
  });
});

describe('BurgerIngredients slice', () => {
  describe('pending handler', () => {
    it('(getBurgerIngredientsThunk) chould set isLoading is true', () => {
      const initialState = {
        buns: [],
        mains: [],
        sauces: [],
        ingredients: [],
        ingredient: null,
        isLoading: false,
        error: null
      };
      const actualState = burgerIngredientsReducer(
        initialState,
        getBurgerIngredientsThunk.pending('')
      );
      expect(actualState.isLoading).toBe(true);
      expect(actualState.error).toBe(null);
    });
  });
  describe('fulfilled handler', () => {
    it('(getBurgerIngredientsThunk) chould set isLoading is false and update and sort ingredients: buns to buns, mains to mains, sauses to sauses, update ingredients', () => {
      const initialState = {
        buns: [],
        mains: [],
        sauces: [],
        ingredients: [],
        ingredient: null,
        isLoading: false,
        error: null
      };
      const dataResponse = [
        {
          calories: 1,
          carbohydrates: 1,
          fat: 1,
          image: 'image',
          image_large: 'image_large',
          image_mobile: 'image_mobile',
          name: 'name',
          price: 1,
          proteins: 1,
          type: 'bun',
          __v: 1,
          _id: '1'
        },
        {
          calories: 1,
          carbohydrates: 1,
          fat: 1,
          image: 'image',
          image_large: 'image_large',
          image_mobile: 'image_mobile',
          name: 'name',
          price: 1,
          proteins: 1,
          type: 'sauce',
          __v: 2,
          _id: '2'
        },
        {
          calories: 1,
          carbohydrates: 1,
          fat: 1,
          image: 'image',
          image_large: 'image_large',
          image_mobile: 'image_mobile',
          name: 'name',
          price: 1,
          proteins: 1,
          type: 'main',
          __v: 2,
          _id: '2'
        }
      ];
      const actualState = burgerIngredientsReducer(
        initialState,
        getBurgerIngredientsThunk.fulfilled(dataResponse, '')
      );
      expect(actualState).toEqual({
        buns: [
          {
            calories: 1,
            carbohydrates: 1,
            fat: 1,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile',
            name: 'name',
            price: 1,
            proteins: 1,
            type: 'bun',
            __v: 1,
            _id: '1'
          }
        ],
        mains: [
          {
            calories: 1,
            carbohydrates: 1,
            fat: 1,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile',
            name: 'name',
            price: 1,
            proteins: 1,
            type: 'main',
            __v: 2,
            _id: '2'
          }
        ],
        sauces: [
          {
            calories: 1,
            carbohydrates: 1,
            fat: 1,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile',
            name: 'name',
            price: 1,
            proteins: 1,
            type: 'sauce',
            __v: 2,
            _id: '2'
          }
        ],
        ingredients: [
          {
            calories: 1,
            carbohydrates: 1,
            fat: 1,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile',
            name: 'name',
            price: 1,
            proteins: 1,
            type: 'bun',
            __v: 1,
            _id: '1'
          },
          {
            calories: 1,
            carbohydrates: 1,
            fat: 1,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile',
            name: 'name',
            price: 1,
            proteins: 1,
            type: 'sauce',
            __v: 2,
            _id: '2'
          },
          {
            calories: 1,
            carbohydrates: 1,
            fat: 1,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile',
            name: 'name',
            price: 1,
            proteins: 1,
            type: 'main',
            __v: 2,
            _id: '2'
          }
        ],
        ingredient: null,
        isLoading: false,
        error: null
      });
    });
  });
  describe('pending rejected', () => {
    it('(getBurgerIngredientsThunk) chould set isLoading is false and update error', () => {
      const initialState = {
        buns: [],
        mains: [],
        sauces: [],
        ingredients: [],
        ingredient: null,
        isLoading: false,
        error: null
      };
      const error = new Error('Ошибка загрузки ингредиентов');
      const actualState = burgerIngredientsReducer(
        initialState,
        getBurgerIngredientsThunk.rejected(error, '')
      );
      expect(actualState.error).toBe('Ошибка загрузки ингредиентов');
      expect(actualState.isLoading).toBe(false);
    });
  });
});
