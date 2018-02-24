import {
  showAllPaper,
  followPaper,
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
      const { data } = yield  call(followPaper, { payload });
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

  },
};
