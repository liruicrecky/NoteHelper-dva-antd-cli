import {
  showAllPaper,
  followPaper,
  unFollowPaper,
  showAllFollowPaper,
} from '../services/Paper';

export default {
  namespace: 'paper',
  state:
    {
      papers: [],
      error: false,
    },
  subscriptions: {},
  effects: {

    // show all papers
    * showAllPaper({ payload }, { call, put }) {
      const { data } = yield call(showAllPaper, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'getAllPapersFailed'
          })
        } else {
          yield put({
            type: 'getAllPapersSuccess',
            payload: data.result,
          });
        }
      }
    },

    // follow paper
    * followPaper({ payload }, { call, put }) {
      const { data } = yield call(followPaper, { payload });
      if (data) {
        if (data.status !== "0001") {
          yield put({
            type: 'followPaperFailed',
          })
        }
      } else {
        yield put({
          type: 'followPaperSuccess',
        });
      }
    },

    // unFollow paper
    * unFollowPaper({ payload }, { call, put }) {
      const { data } = yield call(unFollowPaper, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'unFollowPaperFailed',
          })
        }
      } else {
        yield put({
          type: 'unFollowPaperSuccess',
        });
      }
    },

    // show all follow paper
    * showAllFollowPaper({ payload }, { call, put }) {
      const { data } = yield call(showAllFollowPaper, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'showAllFollowPaperFailed',
          })
        } else {
          yield put({
            type: 'showAllFollowPaperSuccess',
            payload: data.result.list,
          })
        }
      }
    },
  },

  reducers: {

    // show all papers
    getAllPapersFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    getAllPapersSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        papers: payload.Document,
      };
    },

    // follow paper
    followPaperFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    followPaperSuccess(state) {
      return {
        ...state,
        error: false,
      }
    },

    // unFollow paper
    unFollowPaperFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    unFollowPaperSuccess(state) {
      return {
        ...state,
        error: false,
      }
    },

    // show all follow paper
    showAllFollowPaperFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    showAllFollowPaperSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        papers: payload,
      }
    },

  },
};
