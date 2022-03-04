import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.38.17.21:8080/',
  withCredentials: true,
});

const memberApi = {
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

export default memberApi;
