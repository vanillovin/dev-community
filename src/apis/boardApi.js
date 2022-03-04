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

const boardApi = {
  getPost: (id) => api.get(`boards/${id}`),
  getPosts: (page, sort, type) =>
    api.get(`boards?page=${page}&sort=${sort}&type=${type}`),
  getBestPosts: () => api.get('boards/best-likes'),
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
  likePost: (id, t) =>
    api.put(`boards/${id}/likes`, null, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  selectComment: (pId, cId, t) =>
    api.put(`boards/${pId}/comments/${cId}/selections`, null, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  scrapPost: (pId, t) =>
    api.put(`boards/${pId}/scraps`, null, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  searchPosts: (kword, page, cond, type) =>
    api.get(
      `boards/v2?keyWord=${kword}&page=${page}&searchCond=${cond}&type=${type}`
    ),
};

export default boardApi;
