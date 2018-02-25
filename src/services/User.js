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

