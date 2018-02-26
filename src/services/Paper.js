import axios from 'axios';

export const showAllPaper = ({ payload }) => {

  const postUrl = '/api/show?BeginIndex=' + payload.BeginIndex +
    '&PageSize=' + payload.PageSize + '&docType=' + payload.docType;

  return axios.post(postUrl);
};

export const followPaper = ({ payload }) => {
  const { docId, token } = payload;
  const postUrl = '/api/Follow?docId=' + docId;

  return axios.post(postUrl, null, {
    headers: {
      'token': token,
    }
  })
};

export const unFollowPaper = ({ payload }) => {
  const { docId, token } = payload;
  const postUrl = '/api/remove?docId=' + docId;

  return axios.post(postUrl, null, {
    headers: {
      'token': token,
    }
  })
};

export const showAllFollowPaper = ({ payload }) => {
  const { token } = payload;
  return axios.post('/api/showFollow', null, {
    headers: {
      'token': token,
    }
  })
};

export const fetchPaperComment = ({ payload }) => {
  const postUrl = '/api/showComment?docId=' + payload.docId + '&BeginIndex=' + payload.BeginIndex +
    '&PageSize=' + payload.PageSize;

  return axios.post(postUrl);
};

export const commentPaper = ({ payload }) => axios.post('/api/Comment', payload);

export const deletePaperComment = ({ payload }) => {
  const postUrl = '/api/removeComment?mId=' + payload.m_id;
  return axios.post(postUrl, null, {
    headers: {
      'token': payload.token,
    }
  })
};

export const addNewPaper = ({ payload }) => axios.post('/api/createDocument', payload, {
  headers: {
    'token': payload.token,
  }
});

export const searchPaperByKeyword = ({ payload }) => {
  const postUrl = '/api/searchByKeywords?text=' + payload.keyword;
  return axios.post(postUrl, null, {
    headers: {
      'token': payload.token,
    }
  })
};
