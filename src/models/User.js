import { routerRedux } from 'dva/router'
import {
  auth,
  signUp,
  fetchDynamicMessageNum,
  fetchDynamicMessage,
  fetchUserAvatar,
  fetchUserInformation,
  modifyUserInformation,
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
      userInformation: {},
      dynamicMessageNum: 0,
      dynamicMessage: [],
      error: false,
      inDashboard: false,
    },
  subscriptions: {
    setup({ dispatch, history }) {
      const userData = getLocalStorage(storageTokenKey);
      if (userData) {
        dispatch({
          type: 'authSuccess',
          payload: userData,
        })
      }

      history.listen(({ pathname }) => {
        if (pathname.includes('dashboard')) {
          dispatch({
            type: 'fetchDynamicMessageNum'
          });
          dispatch({
            type: 'setInDashBoardTrue'
          });
        } else {
          dispatch({
            type: 'setInDashBoardFalse',
          })
        }
      });
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

          // user's avatar
          yield put({
            type: 'fetchUserAvatar',
            payload: {
              token: data.result.token,
            }
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

      const { data } = yield call(signUp, payload);
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

    // fetch dynamic message numbers
    * fetchDynamicMessageNum({ payload }, { select, call, put }) {
      const isLogin = yield select(state => state.user.isLogin);
      // if not login
      if (!isLogin) {
        yield put(routerRedux.push('/login'));
      } else {
        const userId = yield select(state => state.user.account.userId);
        const { data } = yield call(fetchDynamicMessageNum, { payload: { userId } });
        if (data) {
          if (data.status !== "1") {
            yield put({
              type: 'fetchDynamicMessageNumFailed',
            })
          } else {
            yield put({
              type: 'fetchDynamicMessageNumSuccess',
              payload: data.result.number,
            })
          }
        }
      }
    },

    // fetch dynamic message numbers
    * fetchDynamicMessage({ payload }, { call, put }) {
      const { data } = yield call(fetchDynamicMessage, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchDynamicMessageFailed',
          })
        } else {
          yield put({
            type: 'fetchDynamicMessageSuccess',
            payload: data.result.list,
          })
        }
      }
    },

    // fetch user's avatar
    * fetchUserAvatar({ payload }, { call, put }) {
      const { data } = yield call(fetchUserAvatar, { payload });
      console.log("avatar data: ", data);
      // if (data) {
      //   if (data.status !== "1") {
      //     yield put({
      //       type: 'fetchDynamicMessageFailed',
      //     })
      //   } else {
      //     yield put({
      //       type: 'fetchDynamicMessageSuccess',
      //       payload: data.result.list,
      //     })
      //   }
      // }
    },

    // fetch user's information
    * fetchUserInformation({ payload }, { call, put }) {
      const { data } = yield call(fetchUserInformation, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchUserInformationFailed',
          })
        } else {
          yield put({
            type: 'fetchUserInformationSuccess',
            payload: data.result.list[0],
          })
        }
      }
    },

    // modify user's information
    * modifyUserInformation({ payload }, { call, put }) {
      const { data } = yield call(modifyUserInformation, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'modifyUserInformationFailed',
          })
        } else {
          yield put({
            type: 'modifyUserInformationSuccess',
          });
          yield put(routerRedux.push('/dashboard'))

          // 还需返回相应的用户数据 token等
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
    },

    // dynamic message numbers
    fetchDynamicMessageNumSuccess(state, { payload }) {
      return {
        ...state,
        dynamicMessageNum: payload,
        error: false,
      }
    },

    fetchDynamicMessageNumFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    // dynamic message
    fetchDynamicMessageSuccess(state, { payload }) {
      return {
        ...state,
        dynamicMessage: payload,
        error: false,
      }
    },

    fetchDynamicMessageFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    // dashboard
    setInDashBoardTrue(state) {
      return {
        ...state,
        inDashboard: true,
      }
    },
    setInDashBoardFalse(state) {
      return {
        ...state,
        inDashboard: false,
      }
    },

    // fetch user information
    fetchUserInformationSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        userInformation: payload,
      }
    },
    fetchUserInformationFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    // modify user information
    modifyUserInformationSuccess(state) {
      return {
        ...state,
        error: false,
      }
    },
    modifyUserInformationFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

  },
};

