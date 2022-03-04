import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.38.17.21:8080/',
  withCredentials: true,
});

const commentApi = {
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

export default commentApi;
