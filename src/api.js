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
  getPost: (id) => api.get(`boards/${id}`),
  getPosts: (page, type) => api.get(`boards?page=${page}&type=${type}`),
  sendPost: (type, post, t) =>
    api.post(`boards?type=${type}`, post, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  deletePost: (id, t) =>
    api.delete(`boards/${id}`, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  fixPost: (id, post, t) =>
    api.put(`boards/${id}`, post, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  // likePost: (id, t) =>
  //   api.put(`boards/${id}/likes`, null, {
  //     headers: {
  //       'X-AUTH-TOKEN': t,
  //     },
  //   }),
};

export const commentApi = {
  fixComment: (pId, cId, comment, t) =>
    api.put(`boards/${pId}/comments/${cId}`, comment, {
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
  deleteComment: (pId, cId, t) =>
    api.delete(`boards/${pId}/comments/${cId}`, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  // likeComment: (pId, cId, t) =>
  //   api.put(`boards/${pId}/comments/${cId}/likes`, {
  //     headers: {
  //       'X-AUTH-TOKEN': t,
  //     },
  //   }),
};

export const memberApi = {
  user: (uid) => api.get(`members/${uid}`),
  login: (user) => api.post('members/login', user),
  signup: (user) => api.post('members', user),
  getUserPosts: (uid) => api.get(`members/${uid}/boards`),
  getUserComments: (uid) => api.get(`members/${uid}/comments`),
};
