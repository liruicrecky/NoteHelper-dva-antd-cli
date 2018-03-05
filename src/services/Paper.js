import axios from 'axios';

export const fetchAllPaper = ({ payload }) => {

  const postUrl = '/api/show?BeginIndex=' + payload.BeginIndex +
    '&PageSize=' + payload.PageSize;

  return axios.post(postUrl, null, {
    headers: {
      token: payload.token,
    }
  });
};

export const followPaper = ({ payload }) => {
  const { docId, token } = payload;
  const postUrl = '/api/Follow?docId=' + docId;

  return axios.post(postUrl, null, {
    headers: {
      token: token,
    }
  })
};

export const unFollowPaper = ({ payload }) => {
  const { docId, token } = payload;
  const postUrl = '/api/remove?docId=' + docId;

  return axios.post(postUrl, null, {
    headers: {
      token: token,
    }
  })
};

export const fetchAllFollowPaper = ({ payload }) => {
  const getUrl = '/api/showFollow?BeginIndex=' + payload.BeginIndex + '&PageSize=' + payload.PageSize;
  return axios.get(getUrl, {
    headers: {
      'token': payload.token,
    }
  })
};

export const fetchPaperByTag = ({ payload }) => {
  const postUrl = '/api/searchByTag?tagId=' + payload.tagId;
  return axios.post(postUrl, null, {
    headers: {
      token: payload.token,
    }
  })
};

export const fetchPaperInformation = ({ payload }) => {
  const getUrl = '/api/showDocInformation?docId=' + payload.docId;
  return axios.get(getUrl, {
    headers: {
      token: payload.token,
    }
  });
};

export const fetchPaperComment = ({ payload }) => {
  const postUrl = '/api/showComment?docId=' + payload.docId + '&BeginIndex=' + payload.BeginIndex +
    '&PageSize=' + payload.PageSize;

  return axios.post(postUrl);
};

export const commentPaper = ({ payload }) => axios.post('/api/Comment', payload, {
  headers: {
    token: payload.token,
  }
});

export const deletePaperComment = ({ payload }) => {
  const postUrl = '/api/removeComment?mId=' + payload.m_id;
  return axios.post(postUrl, null, {
    headers: {
      token: payload.token,
    }
  })
};

export const addNewPaper = ({ payload }) => axios.post('/api/createDocument', payload, {
  headers: {
    token: payload.token,
  }
});

export const addMultiPaper = ({ payload }) => {

};

export const searchPaperByKeyword = ({ payload }) => {
  const postUrl = '/api/searchByKeywords?text=' + payload.keyword;
  return axios.post(postUrl, null)
};

export const fetchTopTenPapers = ({ payload }) => axios.post('/api/topTenDoc', null, {
  headers: {
    Token: payload.token,
  }
});
