import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.38.17.21:8080/',
  withCredentials: true,
  // headers: {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  // },
  // proxy: {
  //   protocol: 'http',
  //   host: '3.38.17.21',
  //   port: 8000,
  // },
});

export const boardApi = {
  sendPost: (type, post, t) =>
    api.post(`boards?type=${type}`, post, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  sendComment: (id, content, t) =>
    api.post(`boards/${id}/comments`, content, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  getPost: (id) => api.get(`boards/${id}`),
  getPosts: (page, type) => api.get(`boards?page=${page}&type=${type}`),
};

export const memberApi = {
  user: (id) => api.get(`members/${id}`),
  login: (user) => api.post('members/login', user),
  signup: (user) => api.post('members', user),
};
