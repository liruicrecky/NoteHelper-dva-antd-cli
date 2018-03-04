import axios from 'axios';

export const auth = payload => axios.post('/api/auth', payload);

export const signUp = payload => axios.post('/api/users', payload);

export const fetchDynamicMessageNum = ({ payload }) => {

  const postUrl = '/api/remind?userId=' + payload.userId;

  return axios.post(postUrl, null);
};

export const fetchDynamicMessage = ({ payload }) => {

  const postUrl = '/api/showMessage?userId=' + payload.userId;

  return axios.post(postUrl, null);
};

export const fetchUserInformation = ({ payload }) => axios.post('/api/showInformation', null, {
  headers: {
    "Token": payload.token,
  }
});

export const modifyUserInformation = ({ payload }) => axios.post('/api/ModifyCustomerInformation', payload, {
  headers: {
    "Token": payload.token,
  }
});

export const fetchUserAvatar = ({ payload }) => {

  const postUrl = '/api/GetImgUrl';

  return axios.post(postUrl, null, {
    headers: {
      "token": payload.token,
    }
  })
};

