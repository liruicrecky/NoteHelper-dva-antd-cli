import axios from 'axios';

export const auth = payload => axios.post('/api/auth', payload);

export const signUp = payload => axios.post('/api/users', payload);
