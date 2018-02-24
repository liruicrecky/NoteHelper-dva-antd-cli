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
