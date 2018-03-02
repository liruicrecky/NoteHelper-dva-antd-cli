import axios from 'axios';

export const addCustomTag = ({ payload }) => {

  const { tagName, token } = payload;
  const data = {
    tagName: tagName,
  };

  return axios.post('/api/createCustomLabel', data, {
    headers: {
      'token': token,
    }
  })
};

export const fetchCustomTag = ({ payload }) => axios.post('/api/showCustomLabel', null, {
  headers: {
    'token': payload.token,
  }
});

export const fetchTag = ({ payload }) => axios.post('/api/showTaglib', null, {
  headers: {
    'token': payload.token,
  }
});

export const deleteCustomTag = ({ payload }) => {

  const { tagId, token } = payload;

  const postUrl = '/api/removeLabel?tagId=' + tagId;

  return axios.post(postUrl, null, {
    headers: {
      'token': token,
    }
  })
};

export const addPaperToTag = ({ payload }) => {

  console.log("payload: ", payload);
  const { tagId, docId, token } = payload;
  const data = {
    docId: docId,
    tagId: tagId,
  };

  return axios.post('/api/addDocToLabel', data, {
    headers: {
      'token': token,
    }
  })
};
