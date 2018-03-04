import {
  fetchAllPaper,
  followPaper,
  unFollowPaper,
  fetchAllFollowPaper,
  fetchPaperComment,
  deletePaperComment,
  commentPaper,
  addNewPaper,
  addMultiPaper,
  searchPaperByKeyword,
  fetchPaperByTag,
  fetchPaperInformation,
  fetchTopTenPapers,
} from '../services/Paper';
import { routerRedux } from "dva/router";

export default {
  namespace: 'paper',
  state:
    {
      paperInformation: {},
      paperInformationPublicTags: [],
      paperInformationUserTags: [],
      papers: [],
      tagPapers: [],
      comments: [],
      error: false,
    },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'emptyPapers'
          });
        }
      });
    }
  },
  effects: {

    // fetch all papers
    * fetchAllPaper({ payload }, { call, put }) {
      const { data } = yield call(fetchAllPaper, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchAllPaperFailed'
          })
        } else {
          yield put({
            type: 'fetchAllPaperSuccess',
            payload: data.result,
          });
        }
      }
    },

    // fetch paper by tag
    * fetchPaperByTag({ payload }, { call, put }) {
      const { data } = yield call(fetchPaperByTag, { payload });
      console.log("data: ", data);
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchPaperByTagFailed'
          })
        } else {
          yield put({
            type: 'fetchPaperByTagSuccess',
            payload: data.result.list,
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

    // fetch all follow paper
    * fetchAllFollowPaper({ payload }, { call, put }) {
      const { data } = yield call(fetchAllFollowPaper, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchAllFollowPaperFailed',
          })
        } else {
          yield put({
            type: 'fetchAllFollowPaperSuccess',
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

    // add multi paper
    * addMultiPaper({ payload }, { call, put }) {
      const { data } = yield call(addMultiPaper, { payload });
      console.log("data: ", data);
      /*if (data) {
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
      }*/
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

    // fetch paper information
    * fetchPaperInformation({ payload }, { call, put }) {
      const { data } = yield call(fetchPaperInformation, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchPaperInformationFailed',
          })
        } else {
          yield put({
            type: 'fetchPaperInformationSuccess',
            payload: data.result.list[0],
          });
        }
      }
    },

    // fetch top ten paper
    * fetchTopTenPapers({ payload }, { call, put }) {
      const { data } = yield call(fetchTopTenPapers, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchTopTenPapersFailed',
          })
        } else {
          yield put({
            type: 'fetchTopTenPapersSuccess',
            payload: data.result.list,
          });
        }
      }
    },

  },

  reducers: {

    // show all papers
    fetchAllPaperFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchAllPaperSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        papers: payload.Document,
      };
    },

    // fetch paper by tag
    fetchPaperByTagFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchPaperByTagSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        tagPapers: payload,
      };
    },

    fetchPaperByTagSetTagPapers(state) {
      return {
        ...state,
        error: true,
        tagPapers: [],
      }
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
    fetchAllFollowPaperFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchAllFollowPaperSuccess(state, { payload }) {
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

    // fetch paper information
    fetchPaperInformationFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchPaperInformationSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        paperInformation: payload,
        paperInformationPublicTags: payload.tag,
        paperInformationUserTags: payload.custom,
      }
    },

    // fetch top ten papers
    fetchTopTenPapersFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchTopTenPapersSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
        papers: payload,
      }
    },

    // clean paper
    emptyPapers(state) {
      return {
        ...state,
        papers: [],
      }
    },


  },
};
