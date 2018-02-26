import {
  showAllPaper,
  followPaper,
  unFollowPaper,
  showAllFollowPaper,
  fetchPaperComment,
  deletePaperComment,
  commentPaper,
  addNewPaper,
  searchPaperByKeyword,
} from '../services/Paper';
import { routerRedux } from "dva/router";

export default {
  namespace: 'paper',
  state:
    {
      papers: [],
      comments: [],
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

    // fetch paper comment
    * fetchPaperComment({ payload }, { call, put }) {
      const { data } = yield call(fetchPaperComment, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchPaperCommentFailed',
          })
        } else {
          yield put({
            type: 'fetchPaperCommentSuccess',
            payload: data.result.list,
          })
        }
      }
    },

    // comment paper
    * commentPaper({ payload }, { call, put }) {
      const { data } = yield call(commentPaper, { payload });

      if (data) {
        if (data.status !== "0001") {
          yield put({
            type: 'commentPaperFailed',
          })
        } else {
          yield put({
            type: 'commentPaperSuccess',

          })
        }
      }
    },

    // delete paper comment
    * deletePaperComment({ payload }, { call, put }) {
      const { data } = yield call(deletePaperComment, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'deletePaperCommentFailed',
          })
        } else {
          yield put({
            type: 'deletePaperCommentSuccess',

          })
        }
      }
    },

    // add new paper
    * addNewPaper({ payload }, { call, put }) {
      const { data } = yield call(addNewPaper, { payload });
      console.log("data: ", data);
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'addNewPaperFailed',
          })
        } else {
          yield put({
            type: 'addNewPaperSuccess',
          });
          yield put(routerRedux.push('/dashboard'));
        }
      }
    },

    // search paper use keyword
    * searchPaperByKeyword({ payload }, { call, put }) {
      const { data } = yield call(searchPaperByKeyword, { payload });
      console.log("data: ", data);
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'searchPaperByKeywordFailed',
          })
        } else {
          yield put({
            type: 'searchPaperByKeywordSuccess',
            payload: data.result.list,
          });
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

    // fetch paper comment
    fetchPaperCommentFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchPaperCommentSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        comments: payload,
      }
    },

    // comment paper
    commentPaperFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    commentPaperSuccess(state) {
      return {
        ...state,
        error: false,
      }
    },

    // delete paper comment
    deletePaperCommentFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    deletePaperCommentSuccess(state) {
      return {
        ...state,
        error: false,
      }
    },

    // add new paper
    addNewPaperFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    addNewPaperSuccess(state) {
      return {
        ...state,
        error: false,
      }
    },

    // search paper use keyword
    searchPaperByKeywordFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    searchPaperByKeywordSuccess(state, { payload }) {

      const txt = payload.txt;
      const doc = payload.doc;

      const papers = [];

      if (txt.length > 0) {
        txt.forEach((v) => {
          papers.push(v)
        })
      }

      if (doc.length > 0) {
        doc.forEach((v) => {
          papers.push(v)
        })
      }

      return {
        ...state,
        error: false,
        papers,
      }
    },

  },
};
