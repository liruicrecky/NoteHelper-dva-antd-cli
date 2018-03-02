import {
  addCustomTag,
  fetchCustomTag,
  fetchTag,
  deleteCustomTag,
  addPaperToTag,
} from '../services/Tag';

export default {
  namespace: 'tag',
  state:
    {
      customTags: [],
      customTagNames: [],
      publicTags: [],
      publicTagNames: [],
      error: false,
    },
  subscriptions: {},
  effects: {

    // add custom new tag
    * addCustomTag({ payload }, { call, put }) {
      const { data } = yield call(addCustomTag, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'addCustomTagFailed'
          })
        } else {
          yield put({
            type: 'addCustomTagSuccess',
            payload: data.result,
          });
        }
      }
    },

    // fetch custom tags
    * fetchCustomTag({ payload }, { call, put }) {
      const { data } = yield call(fetchCustomTag, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchCustomTagFailed'
          })
        } else {
          yield put({
            type: 'fetchCustomTagSuccess',
            payload: data.result.list,
          });
        }
      }
    },

    // fetch tags
    * fetchTag({ payload }, { call, put }) {
      const { data } = yield call(fetchTag, { payload });
      if (data) {
        if (data.status !== "1") {
          yield put({
            type: 'fetchTagFailed'
          })
        } else {
          yield put({
            type: 'fetchTagSuccess',
            payload: data.result.list,
          });
        }
      }
    },

    // delete custom tag
    * deleteCustomTag({ payload }, { call, put }) {
      const { data } = yield call(deleteCustomTag, { payload });
      console.log("data: ", data);
      // if (data) {
      //   if (data.status !== "1") {
      //     yield put({
      //       type: 'fetchCustomTagFailed'
      //     })
      //   } else {
      //     yield put({
      //       type: 'fetchCustomTagSuccess',
      //       payload: data.result.list,
      //     });
      //   }
      // }
    },

    // add paper to tag
    * addPaperToTag({ payload }, { call, put }) {
      const { data } = yield call(addPaperToTag, { payload });
      console.log("data: ", data);
      // if (data) {
      //   if (data.status !== "1") {
      //     yield put({
      //       type: 'fetchCustomTagFailed'
      //     })
      //   } else {
      //     yield put({
      //       type: 'fetchCustomTagSuccess',
      //       payload: data.result.list,
      //     });
      //   }
      // }
    },

  },

  reducers: {

    // add custom tag
    addCustomTagFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    addCustomTagSuccess(state, { payload }) {
      return {
        ...state,
        error: false,
      };
    },

    // fetch custom tags
    fetchCustomTagFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchCustomTagSuccess(state, { payload }) {

      const customTags = payload;
      const customTagNames = [];

      customTags.forEach((v) => {
        customTagNames.push(v.tag_name)
      });

      return {
        ...state,
        error: false,
        customTags,
        customTagNames,
      };
    },

    // fetch tags
    fetchTagFailed(state) {
      return {
        ...state,
        error: true,
      }
    },

    fetchTagSuccess(state, { payload }) {
      const allTags = payload;

      const customTags = [];
      const customTagNames = [];

      const publicTags = [];
      const publicTagNames = [];

      allTags.forEach((v) => {
        if (v.tag_Type === 0) {
          publicTags.push(v);
          publicTagNames.push(v.tag_name);
        } else {
          customTags.push(v);
          customTagNames.push(v.tag_name);
        }
      });

      return {
        ...state,
        error: false,
        customTags,
        customTagNames,
        publicTags,
        publicTagNames,
      };
    },

  },
};
