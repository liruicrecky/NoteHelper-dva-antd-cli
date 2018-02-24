import { routerRedux } from 'dva/router'
import {
  auth,
  signUp,
} from '../services/User';
import { storageTokenKey } from '../utils/constant';
import { setLocalStorage, getLocalStorage } from '../utils/helper';

export default {
  namespace: 'user',
  state:
    {
      isLogin: false,
      account: {
        email: null,
        name: null,
        userId: null,
        token: null,
      },
      error: false,
    },
  subscriptions: {
    setup({ dispatch }) {
      const userData = getLocalStorage(storageTokenKey);
      if (userData) {
        dispatch({
          type: 'authSuccess',
          payload: userData,
        })
      }
    }
  },
  effects: {

    // login
    * auth({ payload }, { call, put }) {
      const { email, password, remember } = payload;

      const { data } = yield call(auth, { email, password });
      if (data) {
        // if have error return
        if (data.error && data.error.status === "0") {
          yield put({
            type: 'authFailed',
          })
        } else {

          // save to localStorage
          if (remember)
            setLocalStorage(storageTokenKey, data.result);

          yield put({
            type: 'authSuccess',
            payload: data.result,
          });
          yield put(routerRedux.push('/'));
        }
      } else {

      }
    },

    // logout
    * logout({ payload }, { put }) {
      window.localStorage.removeItem(storageTokenKey);
      yield put({
        type: 'userLogout',
      });
      yield put(routerRedux.push('/login'));
    },

    // signUp
    * signUp({ payload }, { call, put }) {
      const {
        email, name, password, user_identity, user_phone, user_address,
        user_education, user_brithday
      } = payload;

      const { data } = yield call(signUp, {
        email, name, password, user_identity, user_phone, user_address,
        user_education, user_brithday
      });

      if (data) {
        // sign up success
        if (data.status === "1") {
          yield put({
            type: 'signUpSuccess',
            payload: data.result,
          });
          yield put(routerRedux.push('/'))
        } else {
          yield put({
            type: 'signUpFailed',
          })
        }
      }
    },
  },

  reducers: {
    // login
    authFailed(state) {
      return {
        ...state,
        error: true,
      };
    },
    authSuccess(state, { payload }) {
      return {
        ...state,
        account: payload,
        error: false,
        isLogin: true,
      };
    },

    // logout
    userLogout(state) {
      return {
        ...state,
        isLogin: false,
        account: {
          email: null,
          name: null,
          userId: null,
          token: null,
        },
        error: false,
      }
    },

    // sign up
    signUpSuccess(state, { payload }) {
      return {
        ...state,
        account: payload,
        error: false,
        isLogin: true,
      }
    },

    signUpFailed(state) {
      return {
        ...state,
        error: true,
        isLogin: false,
      }
    }

  },
};

