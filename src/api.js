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
  likeComment: (pId, cId, t) =>
    api.put(`boards/${pId}/comments/${cId}/likes`, null, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
};

export const memberApi = {
  getUser: (uid) => api.get(`members/${uid}`),
  fixUser: (uid, user, t) =>
    api.put(`members/${uid}`, user, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  quitUser: (uid, t) =>
    api.delete(`members/${uid}`, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  login: (user) => api.post('members/login', user),
  signup: (user) => api.post('members', user),
  getUserPosts: (uid, page) => api.get(`members/${uid}/boards?page=${page}`),
  getUserData: (uid, type, page) =>
    api.get(`members/${uid}/${type}?page=${page}`),
  getUserComments: (uid, page) =>
    api.get(`members/${uid}/comments?page=${page}`),
  getUserScraps: (uid, page) => api.get(`members/${uid}/scraps?page=${page}`),
  // 사용자의 알림 목록 - 사용자의 알림을 조회합니다.
  getNotices: (uid, page) => api.get(`members/${uid}/notices?page=${page}`),
  // 사용자의 모든 알림 읽기 - 사용자의 모든 알림을 읽음으로 수정.
  readAllNotices: (uid, t) =>
    api.put(`members/${uid}/notices`, null, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  // 사용자의 알림 읽기 - 사용자의 알림을 읽음으로 수정.
  readNotices: (uid, noticeId, t) =>
    api.put(`members/${uid}/notices/${noticeId}`, null, {
      headers: {
        'X-AUTH-TOKEN': t,
      },
    }),
  getNoticeCounts: (uid) => api.get(`/members/${uid}/notices/counts`),
};
